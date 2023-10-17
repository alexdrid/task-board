import ErrnoException = NodeJS.ErrnoException

const { writeFile } = require('fs')

// Configure Angular `environment.ts` file path
const targetPath = './src/environments/environment.ts'

// read environment variables from .env file
require('dotenv').config()

// `environment.ts` file structure
const envConfigFile = `export const environment = {
   production: true,
   supabaseUrl: '${process.env["SUPABASE_URL"]}',
   supabaseKey: '${process.env["SUPABASE_KEY"]}'
  };
`

writeFile(targetPath, envConfigFile, function (err: ErrnoException | null) {
  if (err) {
    throw console.error(err)
  }
})