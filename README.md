# Get PR body action

This action get PR body by PR number

## Inputs

## `pr-number`

**Required**

## `GITHUB_TOKEN`

**Required**

## Outputs

## `body`

PR body

## Example usage

```
- name: Get PR Body
id: get-pull-request-body
uses: yining1023/pr-body-action@v1.2
with:
    pr-number: ${{steps.find-pull-request.outputs.number}}
    GITHUB_TOKEN: '${{ secrets.GITHUB_TOKEN }}'
```
