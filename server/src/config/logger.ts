import { ILogObj, ISettingsParam } from 'tslog';

const loggerSettings: ISettingsParam<ILogObj> = {
  type: 'pretty',
  prettyLogTemplate:
    '{{dd}}-{{mm}}-{{yyyy}} {{hh}}:{{mm}}:{{ss}} {{logLevelName}} {{filePathWithLine}}{{name}}  ',
  prettyErrorTemplate: '{{errorName}} {{errorMessage}}\n{{errorStack}}',
  prettyErrorStackTemplate:
    '  • {{fileName}} - {{method}} - {{filePathWithLine}}',
  prettyLogTimeZone: 'UTC',
  stylePrettyLogs: true,
  prettyLogStyles: {
    logLevelName: {
      '*': ['bold', 'black', 'bgWhiteBright', 'dim'],
      SILLY: ['bold', 'white'],
      TRACE: ['bold', 'whiteBright'],
      DEBUG: ['bold', 'blue'],
      INFO: ['bold', 'blue'],
      WARN: ['bold', 'yellow'],
      ERROR: ['bold', 'red'],
      FATAL: ['bold', 'redBright'],
      REQUEST: ['bold', 'whiteBright'],
    },
    dateIsoStr: 'yellow',
    filePathWithLine: 'white',
    name: ['white', 'bold'],
    nameWithDelimiterPrefix: ['white', 'bold'],
    nameWithDelimiterSuffix: ['white', 'bold'],
    errorName: ['bold', 'bgRedBright', 'white'],
    fileName: ['yellow'],
  },
};

export default loggerSettings;
