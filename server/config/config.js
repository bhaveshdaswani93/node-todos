let env = process.env.NODE_ENV || 'development';
console.log('env===',env);
if( env === 'test' || env === 'development' ) {
    let config = require('./config.json');
    let envConfig = config[env];
    Object.keys(envConfig).forEach((key)=>{
        process.env[key] = envConfig[key];
    })
}