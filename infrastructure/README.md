# Infrastructure

Terraform for Cloudflare. Same layout as pozr-infrastructure.

```
environments/
  dev/             # dev: R2 bucket kadr-dev for local development
modules/
  storage/         # R2 bucket + CORS for direct browser uploads
```

State is local (`environments/<env>/terraform.tfstate`, not committed).

## Apply dev

1. Cloudflare dashboard → My Profile → API Tokens → Create Token → Custom:
   permission `Account` / `Workers R2 Storage` / `Edit`, your account only.
2. Create `environments/dev/terraform.tfvars` (not committed):

   ```hcl
   account_id           = "<cloudflare account id>"
   cloudflare_api_token = "<token from step 1>"
   ```

3. Apply:

   ```sh
   cd infrastructure/environments/dev
   terraform init
   terraform apply
   ```

4. Cloudflare dashboard → R2 → Manage API tokens → Create API token:
   `Object Read & Write`, bucket `kadr-dev` only. Put the values into the
   root `.env`:

   ```
   STORAGE_ENDPOINT=<output storage_endpoint>
   STORAGE_REGION=auto
   STORAGE_BUCKET=<output storage_bucket>
   STORAGE_ACCESS_KEY_ID=<Access Key ID>
   STORAGE_SECRET_ACCESS_KEY=<Secret Access Key>
   STORAGE_FORCE_PATH_STYLE=false
   ```
