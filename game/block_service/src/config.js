const contract_config = {
  name: 'lottyplayman',
  option: {authorization: ['lottyplayman']}
};

const pg_config = {
  user: 'postgres',
  host: '192.168.1.102',
  database: 'lottery',
  password: 'pass@2018',
  port: 5432,
}


module.exports = {
  contract_config,
  pg_config
}