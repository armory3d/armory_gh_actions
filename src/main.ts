
import * as core from '@actions/core';
import { exec } from '@actions/exec';
import * as fs from 'fs';
import * as path from 'path';

async function main(): Promise<void> {
    let blends: string[] = [];
    let targets: string[] = [];
    try {
        let blend = core.getInput('blend', { required: false });
        if (!blend) {
            let _blends = core.getInput('blends', { required: false });
            if (_blends)
                blends = JSON.parse(_blends);
        } else {
            blends.push(blend);
        }
        for (var i in blends) {
            let _blend = blends[i];
            if (path.extname(_blend) !== 'blend') {
                if (fs.lstatSync(_blend).isDirectory()) {
                    let p = path.join(_blend, _blend + '.blend')
                    if (fs.existsSync(p)) {
                        blends[i] = p;
                    }
                }
            }
        }

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
        let release = core.getBooleanInput('release', { required: false });

        await installBlender()

        if (!fs.existsSync('armsdk')) {
            await getArmsdk(repository)
        }

        if (armory_version !== undefined) {
            await checkoutVersion('armsdk/armory', armory_version);
        }

        await enableArmoryAddon()

        for (var _blend of blends) {
            for (var _target of targets) {
                core.startGroup('\u001b[48;5;6m' + _blend + ' → ' + _target);
                console.time(_blend);
                var code = await buildProject(_blend, _target, release);
                core.debug('code:'+code);
                console.timeEnd(_blend);
                core.endGroup();
            }
        }

    } catch (error) {
        core.setFailed(error.message);
    } finally {
        core.exportVariable('build_status', 1)
        core.setOutput('build-status', 1)
    }
}

function info(str: string) {
    //console.info('\u001b[35m' + str);
    console.info(str);
}

async function installBlender() {
    info('Installing blender')
    await exec('sudo', ['snap', 'install', 'blender', '--classic']);
}

async function getArmsdk(repository: string) {
    info('Cloning armsdk')
    await exec('git', ['clone', '--recursive', repository]);
}

async function checkoutVersion(path: string, version: string) {
    info('Checkout ' + path + ' ' + version)
    await exec('git', ['-C', path, 'checkout', version]);
}

async function enableArmoryAddon() {
    info('Enabling armory addon')
    await runBlender(undefined, path.join(__dirname, '..', 'blender/enable_addon.py'))
}

async function buildProject(blend: string, target: string, release: boolean) {
    info(blend + '-' + target + ' release: ' + release)
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
