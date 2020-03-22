import * as I from '../types/interfaces';
export declare function startLoadTesting(configFile: I.ConfigFile, localSchema: string, configPath: string): Promise<I.Result>;
export declare function runLoadTesting(configFile: any, reportsFolder: any, configPath: any): Promise<I.Result>;
