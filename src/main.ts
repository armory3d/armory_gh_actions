
import * as core from '@actions/core';
import { exec, getExecOutput, ExecOutput } from '@actions/exec';
import * as fs from 'fs';
import * as path from 'path';

const LOCAL_ARMSDK_PATH = "_armsdk_"; // TODO HACK to not use local armsdk (https://github.com/armory3d/armsdk/issues/31)

async function main(): Promise<void> {

    let blend = core.getInput('blend', { required: true });
    let exporter_publish = core.getInput('export', { required: false });
    let exporter_build = core.getInput('build', { required: false });
    /*
    if ((exporter_publish === null && exporter_build === null)) {
        core.setFailed('Either export or build have to be specified');
        return;
    }
    if (exporter_publish !== null && exporter_build !== null) {
        core.setFailed('Only set exc');
        return;
    } */
    let blender_version = core.getInput('blender', { required: false });
    let armsdk_repository = core.getInput('armsdk_repository', { required: false });
    let armsdk_version = core.getInput('armsdk', { required: false });
    //let renderpath = core.getInput('renderpath', { required: false });

    core.startGroup('Installing blender ' + blender_version);
    let result = await installBlender(blender_version);
    if (result.exitCode !== 0) {
        core.setFailed(result.stderr);
        core.setOutput('error', result.stderr)
        return;
    }
    core.endGroup();

    core.startGroup('Installing armsdk ' + armsdk_version);
    if (!fs.existsSync(LOCAL_ARMSDK_PATH)) {
        result = await cloneRepository(armsdk_repository, armsdk_version, LOCAL_ARMSDK_PATH);
        if (result.exitCode !== 0) {
            core.setFailed(result.stderr);
            core.setOutput('error', result.stderr)
            return;
        }
        result = await enableArmoryAddon(LOCAL_ARMSDK_PATH);
        if (result.exitCode !== 0) {
            core.setFailed(result.stderr);
            core.setOutput('error', result.stderr)
            return;
        }
    } else {
        if (armsdk_version !== undefined) {
            checkoutRepository(LOCAL_ARMSDK_PATH, armsdk_version);
        }
    }
    core.endGroup();

    if (exporter_publish !== undefined) {
        core.startGroup('Publishing ' + blend + '→' + exporter_publish);
        const t0 = Date.now();
        try {
            result = await publishProject(blend, exporter_publish);
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
    } else if (exporter_build !== undefined) {
        core.startGroup('Building ' + blend + '→' + exporter_build);
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

async function cloneRepository(repository: string, branch: string, path: string): Promise<ExecOutput> {
    let args = ['clone', '--branch', branch, '--recursive', repository, path];
    return getExecOutput('git', args);
}

async function installBlender(version: string): Promise<ExecOutput> {
    let args = ['snap', 'install', 'blender', '--channel=' + version, '--classic'];
    return getExecOutput('sudo', args);
}

async function checkoutRepository(path: string, version: string): Promise<ExecOutput> {
    return getExecOutput('git', ['-C', path, 'checkout', version]);
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
    if (blend !== undefined) args.push(blend);
    if (script !== undefined) args = args.concat(['--python', path.join(__dirname, script)]);
    if (extraArgs !== undefined && extraArgs.length > 0) {
        args.push('--');
        args = args.concat(extraArgs);
    }
    return getExecOutput('blender', args);
}

main();
