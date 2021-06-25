
import * as core from '@actions/core';
import { exec } from '@actions/exec';
import * as fs from 'fs';
import * as path from 'path';

async function main(): Promise<void> {
    try {

        
        const blend = core.getInput('blend', { required: true });
        const target = core.getInput('target', { required: true });
        const repository = core.getInput('repository', { required: false });
        
        console.log(blend, target, repository);
        core.info(blend);
        core.info(target);
        core.info(repository);
        
        await installBlender()
        await getArmsdk(repository)
        await enableArmory()
        await buildProject(blend, target)

    } catch (error) {
        core.setFailed(error.message);
    }
}

async function installBlender() {
    core.info('\u001b[38;2;255;0;0mInstalling blender')
    await exec('sudo', ['snap', 'install', 'blender', '--classic']);
}

async function getArmsdk(repository: string) {
    core.info('\u001b[38;2;255;0;0mDownloading armsdk')
    await exec('git', ['clone', '--recursive', repository]);
}

async function enableArmory() {
    core.info('\u001b[38;2;255;0;0mEnabling armory addon')
    // await exec('blender', ['-noaudio', '-b', '--python', path.join(__dirname, '..', 'blender/enable_addon.py')]);
    await runBlender(undefined, path.join(__dirname, '..', 'blender/enable_addon.py'))
}

async function buildProject(blend: string, target: string) {
    core.info('\u001b[38;2;255;0;0mBuilding project')
    // let args = ['-noaudio', '-b', blend, '--python', path.join(__dirname, '..', 'blender/publish_project.py'), '--', target]
    //await exec('blender', args);
    await runBlender(blend, path.join(__dirname, '..', 'blender/publish_project.py'), [target])
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
