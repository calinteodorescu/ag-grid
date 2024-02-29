/* eslint-disable no-console */
import path from 'path';
import fs from 'fs/promises';

import { readFile, readJSONFile, writeFile } from '../../executors-utils';
import gridVanillaSrcParser from './generator/transformation-scripts/grid-vanilla-src-parser';
import { ExampleConfig, ExampleType, FRAMEWORKS, GeneratedContents } from './generator/types';

import { SOURCE_ENTRY_FILE_NAME } from './generator/constants';
import {
    getBoilerPlateFiles,
    getEntryFileName,
    getIsEnterprise,
    getMainFileName,
    getProvidedExampleFiles,
    getProvidedExampleFolder,
    getTransformTsFileExt,
} from './generator/utils/fileUtils';
import { getStyleFiles } from './generator/utils/getStyleFiles';
import { getOtherScriptFiles } from './generator/utils/getOtherScriptFiles';
import { frameworkFilesGenerator } from './generator/utils/frameworkFilesGenerator';
import { getPackageJson } from './generator/utils/getPackageJson';

export type ExecutorOptions = {
    mode: 'dev' | 'prod';
    outputPath: string;
    examplePath: string;
    inputs: string[];
    output: string;
};

export default async function (options: ExecutorOptions) {
    try {
        await generateFiles(options);

        return { success: true, terminalOutput: `Generating example [${options.examplePath}]` };
    } catch (e) {
        console.error(e);
        return { success: false };
    }
}

async function getGridOptionsType() {
    return await readJSONFile('plugins/ag-grid-generate-example-files/gridOptionsTypes/_gridOptions_Types.json');
}

async function getSourceFileList(folderPath: string): Promise<string[]> {
    const sourceFileList = await fs.readdir(folderPath);
    if (sourceFileList.includes('SKIP_EXAMPLE_GENERATION.md')) {
        const msg = `Skipping example generation for ${folderPath} as there is a SKIP_EXAMPLE_GENERATION.md file present.`;
        console.log(msg);
        return undefined;
    }
    if (!sourceFileList.includes(SOURCE_ENTRY_FILE_NAME)) {
        throw new Error('Unable to find example entry-point at: ' + folderPath);
    }
    return sourceFileList;
}

async function getExampleTypeAndProvidedFiles(folderPath: string) {
    const frameworkProvidedExamples = {};

    for await (const internalFramework of FRAMEWORKS) {
        const files = getProvidedExampleFiles({ folderPath, internalFramework });

        if (files.length > 0) {
            const providedExampleBasePath = getProvidedExampleFolder({
                folderPath,
                internalFramework,
            });
            const providedExampleEntries = await Promise.all(
                files.map(async (fileName) => {
                    let contents = (await fs.readFile(path.join(providedExampleBasePath, fileName))).toString('utf-8');
                    return [fileName, contents];
                })
            );
            const asObj = Object.fromEntries(providedExampleEntries);
            frameworkProvidedExamples[internalFramework] = asObj;
        }
    }
    return frameworkProvidedExamples;
}

export async function generateFiles(options: ExecutorOptions) {
    const isDev = options.mode === 'dev';
    const folderPath = options.examplePath;
    const gridOptionsTypes = await getGridOptionsType();

    const sourceFileList = await getSourceFileList(folderPath);
    if (sourceFileList === undefined) {
        return { generatedFiles: {} } as any;
    }

    let exampleConfig: ExampleConfig = {};
    if (sourceFileList.includes('exampleConfig.json')) {
        exampleConfig = await readJSONFile(path.join(folderPath, 'exampleConfig.json'));
    }
    const entryFilePath = path.join(folderPath, SOURCE_ENTRY_FILE_NAME);

    const [entryFile, indexHtml, styleFiles] = await Promise.all([
        readFile(entryFilePath),
        readFile(path.join(folderPath, 'index.html')),
        getStyleFiles({ folderPath, sourceFileList }),
    ]);

    const isEnterprise = getIsEnterprise({ entryFile });
    let entryType: ExampleType = sourceFileList.includes('provided') ? 'mixed' : 'generated';

    const frameworkProvidedExamples = entryType === 'mixed' ? await getExampleTypeAndProvidedFiles(folderPath) : {};

    const { bindings, typedBindings } = gridVanillaSrcParser(
        folderPath,
        entryFile,
        indexHtml,
        entryType,
        frameworkProvidedExamples,
        gridOptionsTypes
    );

    for (const internalFramework of FRAMEWORKS) {
        const [otherScriptFiles, componentScriptFiles] = await getOtherScriptFiles({
            folderPath,
            sourceFileList,
            transformTsFileExt: getTransformTsFileExt(internalFramework),
            internalFramework,
        });

        const getFrameworkFiles = frameworkFilesGenerator[internalFramework];
        if (!getFrameworkFiles) {
            throw new Error(`No entry file config generator for '${internalFramework}'`);
        }

        const boilerPlateFiles = await getBoilerPlateFiles(isDev, internalFramework);
        const entryFileName = getEntryFileName(internalFramework)!;
        const mainFileName = getMainFileName(internalFramework)!;
        const provideFrameworkFiles = frameworkProvidedExamples[internalFramework];

        for (const importType of ['modules', 'packages'] as const) {
            const packageJson = getPackageJson({
                isEnterprise,
                internalFramework,
                importType,
            });

            let frameworkExampleConfig = {
                ...exampleConfig,
                ...(provideFrameworkFiles ? provideFrameworkFiles['exampleConfig.json'] : {}),
            };
            const { files, scriptFiles } =
                provideFrameworkFiles === undefined
                    ? await getFrameworkFiles({
                          entryFile,
                          indexHtml,
                          isEnterprise,
                          bindings,
                          typedBindings,
                          componentScriptFiles,
                          otherScriptFiles,
                          ignoreDarkMode: false,
                          isDev,
                          importType,
                          exampleConfig: frameworkExampleConfig,
                      })
                    : { files: {}, scriptFiles: [] };

            const result: GeneratedContents = {
                isEnterprise,
                entryFileName,
                mainFileName,
                scriptFiles: scriptFiles!,
                styleFiles: Object.keys(styleFiles),
                sourceFileList,
                // Replace files with provided examples
                files: { ...styleFiles, ...files, ...provideFrameworkFiles },
                // Files without provided examples
                generatedFiles: files,
                boilerPlateFiles,
                providedExamples: provideFrameworkFiles ?? {},
                packageJson,
                ...frameworkExampleConfig,
            };

            const outputPath = path.join(options.outputPath, importType, internalFramework, 'contents.json');
            await writeFile(outputPath, JSON.stringify(result));

            for (const name in result.generatedFiles) {
                if (typeof result.generatedFiles[name] !== 'string') {
                    throw new Error(`${outputPath}: non-string file content`);
                }
            }
        }
    }
}

//  node --inspect-brk ./plugins/ag-grid-generate-example-files/dist/src/executors/generate/executor.js
// console.log('should generate')
// generateFiles({
//     examplePath: 'documentation/ag-grid-docs/src/content/docs/getting-started/_examples/working-with-data-example',
//     mode: 'dev',
//     inputs: [],
//     output: '',
//     outputPath: 'dist/generated-examples/ag-grid-docs/docs/getting-started/_examples/working-with-data-example',
// }).then(() => console.log('done'));
