
import * as core from '@actions/core';
import { exec } from '@actions/exec';
import * as fs from 'fs';

async function main(): Promise<void> {
    try {

        const repository = core.getInput('repository');
        const blend = core.getInput('blend');
        
        console.log(blend, repository);

        installBlender()
        installArmory(repository)
        buildProject(blend)

        /*
        const repo = core.getInput('repo');
        const projectfile = core.getInput('projectfile');
        const target = core.getInput('target');
        const graphics = core.getInput('graphics');
        const audio = core.getInput('audio');
        const shaderversion = core.getInput('shaderversion');
        const ffmpeg = core.getInput('ffmpeg');
        // const noshaders = core.getBooleanInput('noshaders');
        // const noproject = core.getBooleanInput('noproject');
        const compile = core.getInput('compile');
        console.log(compile);

        if (target !== "html5") {
            await setupNative();
        }

        if (!fs.existsSync("Kha")) {
            await setupKha(repo);
        }

        let args = ['Kha/make.js'];
        if (target !== undefined && target !== "") {
            args.push('--target');
            args.push(target);
        }
        if (projectfile !== undefined && projectfile !== "") {
            args.push('--projectfile');
            args.push(projectfile);
        }
        if (graphics !== undefined && graphics !== "") {
            args.push('--graphics');
            args.push(graphics);
        }
        if (audio !== undefined && audio !== "") {
            args.push('--audio');
            args.push(audio);
        }
        if (shaderversion !== undefined && shaderversion !== "") {
            args.push('--shaderversion');
            args.push(shaderversion);
        }
        if (ffmpeg !== undefined && ffmpeg !== "") {
            args.push('--ffmpeg');
            args.push(ffmpeg);
        }
        /* if (noshaders) {
            args.push('--noshaders');
        }
        if (noproject) {
            args.push('--noproject');
        }
        * /
        if (compile === "true") {
            args.push('--compile');
        }

        await build(args);
        */

    } catch (error) {
        core.setFailed(error.message);
    }
}

async function installBlender() {
    await exec('sudo', ['snap', 'install', 'blender', '--classic']);
}

async function installArmory(repository: string) {
    await exec('git', ['clone', '--recursive', repository]);
    await exec('blender', ['-noaudio', '-b', '--python', 'blender/enable_addon.py']);
}

async function buildProject(blend: string) {
    let args = ['-noaudio', '-b', blend, '--python', 'blender/publish_project.py']
    await exec('blender', args);
}

main();
