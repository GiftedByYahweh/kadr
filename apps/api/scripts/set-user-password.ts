import { askCredentials, runCli } from './cli.ts';

await runCli(async (container, prompt) => {
  const credentials = await askCredentials(prompt);
  await container.useCases.auth.setUserPassword.execute(credentials);
  return `Password for ${credentials.email} updated, all sessions closed`;
});
