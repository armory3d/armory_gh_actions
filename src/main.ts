
import * as core from '@actions/core';
import { exec } from '@actions/exec';
import * as fs from 'fs';
import * as path from 'path';

async function main(): Promise<void> {
    try {

        core.info('\u001b[38;2;255;0;0mARMORY3D')

        core.addPath('/path/to/mytool');

        const blend = core.getInput('blend', { required: true });
        const target = core.getInput('target', { required: true });
        const repository = core.getInput('repository', { required: false });

        console.log(blend, target, repository);
        core.info(blend);
        core.info(target);
        core.info(repository);

        await installBlender()
        await installArmory(repository)
        await enableArmory()
        await buildProject(blend, target)

    } catch (error) {
        core.setFailed(error.message);
    }
}

async function installBlender() {
    await exec('sudo', ['snap', 'install', 'blender', '--classic']);
}

async function installArmory(repository: string) {
    await exec('git', ['clone', '--recursive', repository]);
}

async function enableArmory() {
    await exec('blender', ['-noaudio', '-b', '--python', path.join(__dirname, 'blender/enable_addon.py')]);
}

async function buildProject(blend: string, target: string) {
    let args = ['-noaudio', '-b', blend, '--python', path.join(__dirname, 'blender/publish_project.py'),'--',target]
    await exec('blender', args);
}

main();
