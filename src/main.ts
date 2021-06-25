
import * as core from '@actions/core';
import { exec } from '@actions/exec';
import * as fs from 'fs';
import * as path from 'path';

async function main(): Promise<void> {
    try {

        let blends: string[] = [];
        let blend = core.getInput('blend', { required: false });
        if (!blend) {
            let _blends = core.getInput('blends', { required: false });
            if (_blends)
                blends = JSON.parse(_blends);
        } else {
            blends.push(blend);
        }

        let targets: string[] = [];
        let target = core.getInput('target', { required: false });
        if (!target) {
            let _targets = core.getInput('targets', { required: false });
            if (_targets)
                targets = JSON.parse(_targets);
        } else {
            targets.push(target);
        }

        let armory_version = core.getInput('armory_version', { required: false });
        let repository = core.getInput('repository', { required: false });
        let release = core.getBooleanInput('release', { required: true });

        core.info('Installing blender')
        await installBlender()

        if( !fs.existsSync('armsdk') ) {
            core.info('Downloading armsdk')
            await getArmsdk(repository)
        }

        if (armory_version !== undefined) {
            core.info('Chaning armory version')
            await checkoutVersion('armsdk/armory', armory_version);
        }

        core.info('Enabling armory addon')
        await enableArmoryAddon()

        for (var _blend of blends) {
            for (var _target of targets) {
                core.info('Building ' + _blend + ' (' + _target + ')')
                await buildProject(_blend, _target, release)
            }
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
    await runBlender(blend, path.join(__dirname, '..', 'blender/build_project.py'), [release ? 'release' : 'build', target])
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
