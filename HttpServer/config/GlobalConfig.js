const stage = process.argv[2];

if (stage == 'dev') {
    process.env.stage = 'dev';
}
else if (stage == 'live') {
    process.env.stage = 'live';
}

