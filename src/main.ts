
import * as fs from 'fs';
import * as path from 'path';
import * as core from '@actions/core';
import * as io from '@actions/io';
import { getExecOutput, ExecOutput } from '@actions/exec';

const ARMSDK_PATH = "_armsdk_"; // TODO HACK to not use local armsdk (https://github.com/armory3d/armsdk/issues/31)
const BLENDER_BIN = "/snap/bin/blender";

async function main(): Promise<void> {

    let blend = core.getInput('blend', { required: true });
    let exporter_build = core.getInput('build', { required: false });
    let exporter_publish = core.getInput('publish', { required: false });
    let blender_version = core.getInput('blender', { required: false });
    let armsdk_url = core.getInput('armsdk_url', { required: false });
    let armsdk_ref = core.getInput('armsdk_ref', { required: false });
    // let armory_ref = core.getInput('armory_ref', { required: false });
    //let renderpath = core.getInput('renderpath', { required: false });

    /* const blenderPath: string = await io.which('blender', true);
    if (blenderPath) {
        core.warning('Blender already installed');
    } */

    core.startGroup('Installing blender ' + blender_version);
    let result = await installBlender(blender_version);
    if (result.exitCode !== 0) {
        core.setFailed('Failed to install blender');
        core.setOutput('error', result.stderr);
        core.endGroup();
        return;
    }
    core.endGroup();

    core.startGroup('Installing armsdk ' + armsdk_ref);
    /*
    if (!fs.existsSync(ARMSDK_PATH)) {
        result = await cloneRepository(armsdk_repository, ARMSDK_PATH, armsdk_version);
        if (result.exitCode !== 0) {
            core.setFailed(result.stderr);
            core.setOutput('error', result.stderr)
            return;
        }
        result = await enableArmoryAddon(ARMSDK_PATH);
        if (result.exitCode !== 0) {
            core.setFailed(result.stderr);
            core.setOutput('error', result.stderr)
            return;
        }
    } else {
        if (armsdk_version) {
            checkoutRepository(ARMSDK_PATH, armsdk_version);
        }
    }
    */
    if (!fs.existsSync(ARMSDK_PATH)) {
        result = await cloneRepository(armsdk_url, ARMSDK_PATH, armsdk_ref);
        if (result.exitCode !== 0) {
            core.setFailed('Failed to install armsdk');
            core.setOutput('error', result.stderr);
            core.endGroup();
            return;
        }
        result = await enableArmoryAddon(ARMSDK_PATH);
        if (result.exitCode !== 0) {
            core.setFailed('Failed to enable armory addon');
            core.setOutput('error', result.stderr);
            core.endGroup();
            return;
        }
    } else {
        core.warning('armsdk already exists');
    }
    core.endGroup();

    // if (armory_ref) await checkoutRepository(ARMSDK_PATH + '/armory', armory_ref);

    if (exporter_publish) {
        core.startGroup('Publishing ' + blend + ' ' + exporter_publish);
        const t0 = Date.now();
        try {
            result = await publishProject(blend, exporter_publish);
            const time = Date.now() - t0;
            core.setOutput('code', result.exitCode);
            core.setOutput('time', time);
            if (result.exitCode === 0) {
                core.setOutput('result', result.stdout);
            } else {
                core.setOutput('error', result.stderr);
                core.setFailed(result.stderr);
            }
        } catch (error: any) {
            core.setOutput('error', error);
            core.setFailed(error.message);
        }
        core.endGroup();
    } else if (exporter_build) {
        core.startGroup('Building ' + blend + ' ' + exporter_build);
        const t0 = Date.now();
        try {
            result = await buildProject(blend, exporter_build);
            const time = Date.now() - t0;
            core.setOutput('code', result.exitCode)
            core.setOutput('time', time)
            if (result.exitCode === 0)
                core.setOutput('result', result.stdout)
            else {
                core.setOutput('error', result.stderr)
                core.setFailed(result.stderr);
            }
        } catch (error: any) {
            core.setFailed(error.message);
        }
        core.endGroup();
    }
}

async function cloneRepository(repository: string, path: string, branch?: string): Promise<ExecOutput> {
    let args = ['clone', '--recursive', repository, path];
    if (branch) args = args.concat('--branch', branch);
    return getExecOutput('git', args);
}

async function checkoutRepository(path: string, version: string): Promise<ExecOutput> {
    return getExecOutput('git', ['-C', path, 'checkout', version]);
}

async function installBlender(version: string): Promise<ExecOutput> {
    let args = ['snap', 'install', 'blender', '--channel=' + version, '--classic'];
    return getExecOutput('sudo', args);
}

async function enableArmoryAddon(path: string): Promise<ExecOutput> {
    return runBlender(undefined, 'blender/addon_install.py', [path])
}

async function buildProject(blend: string, exporter: string): Promise<ExecOutput> {
    return runBlender(blend, 'blender/build_project.py', [exporter]);
}

async function publishProject(blend: string, exporter: string): Promise<ExecOutput> {
    return runBlender(blend, 'blender/publish_project.py', [exporter]);
}

async function runBlender(blend?: string, script?: string, extraArgs?: string[]): Promise<ExecOutput> {
    let args = ['-noaudio', '-b'];
    if (blend) args.push(blend);
    if (script) args = args.concat(['--python', path.join(__dirname, script)]);
    if (extraArgs && extraArgs.length > 0) {
        args.push('--');
        args = args.concat(extraArgs);
    }
    return getExecOutput('blender', args);
}

main();
