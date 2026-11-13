import { loginRequestSchema } from '@kadr/shared';
import { loadAppConfig } from '@config';
import { appContainer, type AppContainer } from '@container/index.ts';
import { ConsoleLogger } from '@logger/index.ts';
import { Prompt } from './prompt.ts';

const CLI_TAG = 'CLI';

export interface Credentials {
  email: string;
  password: string;
}

export async function askCredentials(prompt: Prompt): Promise<Credentials> {
  const email = await prompt.ask('Email: ');
  const password = await prompt.askHidden('Password: ');
  const confirmation = await prompt.askHidden('Repeat password: ');
  if (password !== confirmation) throw new Error('Passwords do not match');

  const result = loginRequestSchema.safeParse({ email, password });
  if (!result.success) {
    const issue = result.error.issues[0];
    const field = issue ? issue.path.join('.') : 'input';
    const message = issue ? issue.message : 'Invalid input';
    throw new Error(`${field}: ${message}`);
  }
  return result.data;
}

export async function runCli(
  action: (container: AppContainer, prompt: Prompt) => Promise<string>,
): Promise<void> {
  const logger = new ConsoleLogger();
  const config = loadAppConfig();
  const container = appContainer(config, logger);
  const prompt = new Prompt();

  try {
    const message = await action(container, prompt);
    logger.info(CLI_TAG, message);
  } catch (error) {
    logger.error(CLI_TAG, 'Command failed', error);
    process.exitCode = 1;
  } finally {
    prompt.close();
    await container.infrastructure.dbProvider.close();
  }
}
