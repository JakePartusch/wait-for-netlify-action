# Wait for Netlify GitHub Action 🎉

Do you have other Github actions (Lighthouse, Cypress, etc) that depend on the Netlify Preview URL? This action will wait until the url is available before running the next task.

## Inputs

### `site_name`

**Required** The name of the Netlify site to reach `https://{site_name}.netlify.com`

### `max_timeout`

Optional — The amount of time to spend waiting on Netlify. Defaults to `60` seconds

## Example usage

```
steps:
  - name: Waiting for 200 from the Netlify Preview
    uses: actions/wait-for-netlify-action@v1
    id: waitFor200
    with:
      site_name: "jakepartusch"
      max_timeout: 60
```
