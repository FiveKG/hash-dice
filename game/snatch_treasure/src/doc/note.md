## note
* 在执行区块链转账或者调用合约时，如果段时间内重复转帐给同一个用户，或者调用合约，会存在双花的问题，交易会被驳回
* 解决办法是：
    * 把相同的收款账户的交易合并为一个，或者每笔交易设置一定的时间间隔
    * 并发的时候