import { askCredentials, runCli } from './cli.ts';

await runCli(async (container, prompt) => {
  const username = await prompt.ask('Username: ');
  if (!username) throw new Error('Username is required');

  const credentials = await askCredentials(prompt);
  const user = await container.auth.createUser.execute({
    username,
    email: credentials.email,
    password: credentials.password,
  });
  return `User ${user.email} created`;
});
