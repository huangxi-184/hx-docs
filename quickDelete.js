import { rimraf } from 'rimraf';
import path from 'path';

// 当前工作目录
const currentDirectory = process.cwd();

// 要删除的目录
const nodeModulesDirectory = path.join(currentDirectory, 'node_modules');

// Rimraf options
const rimrafOptions = {
    // Specify additional options here, if needed
    maxBusyTries: 10, // Example option
};

// 使用 rimraf 删除目录
rimraf(nodeModulesDirectory, rimrafOptions, (err) => {
    if (err) {
        console.error(err);
    } else {
        console.log('node_modules 目录已删除。');
    }
});
