import type { CalendarModuleSource } from '../../app';
import {
  readValueAtPath,
  SillyTavernMessageVariableReader,
} from './message-variables';

export type CalendarModuleInputParser<TInput> = (
  value: unknown,
) => readonly TInput[] | null;

export interface SillyTavernMessageModuleSourceOptions<TInput> {
  reader: SillyTavernMessageVariableReader;
  path: string | readonly string[];
  parser: CalendarModuleInputParser<TInput>;
}

export class SillyTavernMessageModuleSource<TInput>
  implements CalendarModuleSource<TInput>
{
  private readonly reader: SillyTavernMessageVariableReader;
  private readonly path: string | readonly string[];
  private readonly parser: CalendarModuleInputParser<TInput>;

  constructor(options: SillyTavernMessageModuleSourceOptions<TInput>) {
    this.reader = options.reader;
    this.path = options.path;
    this.parser = options.parser;
  }

  load(): readonly TInput[] {
    const variables = this.reader.readLatest();
    const raw = readValueAtPath(variables, this.path);
    const input = this.parser(raw);

    if (!input) {
      const pathLabel = Array.isArray(this.path)
        ? this.path.join('.')
        : this.path;

      throw new Error(
        `Unable to parse calendar module data at message variable path "${pathLabel}"`,
      );
    }

    return input;
  }
}
