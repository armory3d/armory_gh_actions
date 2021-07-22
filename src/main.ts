
import * as core from '@actions/core';
import { exec } from '@actions/exec';
import * as fs from 'fs';
import * as path from 'path';

async function main(): Promise<void> {

    console.log(__dirname);

    let blend = core.getInput('blend', { required: true });
    let exporter = core.getInput('exporter', { required: false });
    //let blender_version = core.getInput('blender_version', { required: false });
    let armsdk_repository = core.getInput('armsdk_repository', { required: false });
    let armory_version = core.getInput('armory_version', { required: false });
    //let renderpath = core.getInput('renderpath', { required: false });

    core.startGroup('Settings');
    core.info('blend: ' + blend);
    core.info('exporter: ' + exporter);
    //core.info('blender_version: ' + blender_version);
    core.info('armsdk_repository: ' + armsdk_repository);
    core.info('armory_version: ' + armory_version);
    //core.info('renderpath: ' + renderpath);
    core.endGroup();

    core.startGroup('Install blender');
    //await installBlender(blender_version);
    await installBlender();
    await exec('blender', ['--version']);
    core.endGroup();

    core.startGroup('Installing armory');
    if (!fs.existsSync('armsdk')) {
        await installArmsdk(armsdk_repository);
        var code = await enableArmoryAddon();
        core.debug('code: ' + code);
    }
    core.endGroup();

    if (armory_version !== undefined) {
        info('Checkout ' + path + ' ' + armory_version)
        await checkoutVersion('armsdk/armory', armory_version);
    }

    if (exporter === undefined) {
        core.startGroup('Build project');
        try {
            var code = await buildProject(blend);
            console.info('code: ' + code);
            core.exportVariable('code', code);
        } catch (error) {
            core.setFailed(error.message);
            core.exportVariable('code', 1);
        }
        core.endGroup();
    } else {
        core.startGroup('Export ' + blend + '→' + exporter);
        try {
            var code = await exportProject(blend, exporter);
            console.info('code: ' + code);
            core.exportVariable('code', code);
        } catch (error) {
            core.setFailed(error.message);
            core.exportVariable('code', 1);
        }
        core.endGroup();
    }
}

function info(str: string) {
    //console.info('\u001b[35m' + str);
    console.info(str);
}

// async function installBlender(version: string) {
async function installBlender() {
    let args = ['snap', 'install', 'blender'];
    // if (version !== undefined) args.push('--channel=' + version); //TODO
    args.push('--classic');
    await exec('sudo', args);
}

async function installArmsdk(repository: string) {
    await exec('git', ['clone', '--recursive', repository]);
}

async function checkoutVersion(path: string, version: string) {
    await exec('git', ['-C', path, 'checkout', version]);
}

async function enableArmoryAddon() {
    await runBlender(undefined, 'blender/addon_install.py', ['armsdk'])
}

async function buildProject(blend: string) {
    await runBlender(blend, 'blender/project_build.py')
}

async function exportProject(blend: string, exporter: string) {
    await runBlender(blend, path.join(__dirname, 'blender/project_export.py'), [exporter])
}

async function runBlender(blend?: string, script?: string, extraArgs?: string[]) {
    let out = '';
    let err = '';
    const options = {
        listeners: {
            stdout: (data: Buffer) => {
                out += data.toString();
            },
            stderr: (data: Buffer) => {
                err += data.toString();
            }
        }
    };
    let args = ['-noaudio', '-b'];
    if (blend !== undefined) args.push(blend);
    if (script !== undefined) args = args.concat(['--python', script]);
    if (extraArgs !== undefined) {
        args.push('--');
        args = args.concat(extraArgs);
    }
    await exec('blender', args, options);
}

main();
