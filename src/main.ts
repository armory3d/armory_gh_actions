
import * as core from '@actions/core';
import { exec } from '@actions/exec';
import * as fs from 'fs';
import * as path from 'path';

async function main(): Promise<void> {
    try {

        let blend = core.getInput('blend', { required: true });
        // let target = core.getInput('target', { required: true });
        let targets: string[] = JSON.parse(core.getInput('targets', { required: true }));
        let armory_version = core.getInput('armory_version', { required: false });
        let repository = core.getInput('repository', { required: false });
        let release = core.getBooleanInput('release', { required: true });

        core.info('Installing blender')
        await installBlender()

        core.info('Downloading armsdk')
        await getArmsdk(repository)

        if (armory_version !== undefined) {
            core.info('Chaning armory version')
            await checkoutVersion('armsdk/armory', armory_version);
        }

        core.info('Enabling armory addon')
        await enableArmoryAddon()

        for (var target of targets) {
            core.info('Building ' + blend + ' (' + target + ')')
            await buildProject(blend, target, release)
        }

    } catch (error) {
        core.setFailed(error.message);
    }
}

async function installBlender() {
    await exec('sudo', ['snap', 'install', 'blender', '--classic']);
}

async function getArmsdk(repository: string) {
    await exec('git', ['clone', '--recursive', repository]);
}

async function checkoutVersion(path: string, version: string) {
    await exec('git', ['-C', path, 'checkout', version]);
}

async function enableArmoryAddon() {
    await runBlender(undefined, path.join(__dirname, '..', 'blender/enable_addon.py'))
}

async function buildProject(blend: string, target: string, release: boolean) {
    await runBlender(blend, path.join(__dirname, '..', 'blender/build_project.py'), [release?'release':'build',target])
}

async function runBlender(blend?: string, script?: string, extraArgs?: string[]) {
    let args = ['-noaudio', '-b']
    if (blend !== undefined) args.push(blend);
    if (script !== undefined) args = args.concat(['--python', script]);
    if (extraArgs !== undefined) {
        args.push('--');
        args = args.concat(extraArgs);
    }
    await exec('blender', args);
}

main();
