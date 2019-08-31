#include <eosio.token/eosio.token.hpp>

namespace eosio {

void token::create( const name&   issuer,
                    const asset&  maximum_supply )
{
    require_auth( get_self() );

    auto sym = maximum_supply.symbol;
    check( sym.is_valid(), "invalid symbol name" );
    check( maximum_supply.is_valid(), "invalid supply");
    check( maximum_supply.amount > 0, "max-supply must be positive");

    stats statstable( get_self(), sym.code().raw() );
    auto existing = statstable.find( sym.code().raw() );
    check( existing == statstable.end(), "token with symbol already exists" );

    statstable.emplace( get_self(), [&]( auto& s ) {
       s.supply.symbol = maximum_supply.symbol;
       s.max_supply    = maximum_supply;
       s.issuer        = issuer;
    });
}


void token::issue( const name& to, const asset& quantity, const string& memo )
{
    auto sym = quantity.symbol;
    check( sym.is_valid(), "invalid symbol name" );
    check( memo.size() <= 256, "memo has more than 256 bytes" );

    stats statstable( get_self(), sym.code().raw() );
    auto existing = statstable.find( sym.code().raw() );
    check( existing != statstable.end(), "token with symbol does not exist, create token before issue" );
    const auto& st = *existing;
    check( to == st.issuer, "tokens can only be issued to issuer account" );

    require_auth( st.issuer );
    check( quantity.is_valid(), "invalid quantity" );
    check( quantity.amount > 0, "must issue positive quantity" );

    check( quantity.symbol == st.supply.symbol, "symbol precision mismatch" );
    check( quantity.amount <= st.max_supply.amount - st.supply.amount, "quantity exceeds available supply");

    statstable.modify( st, same_payer, [&]( auto& s ) {
       s.supply += quantity;
    });

    add_balance( st.issuer, quantity, st.issuer );
}

void token::retire( const asset& quantity, const string& memo )
{
    auto sym = quantity.symbol;
    check( sym.is_valid(), "invalid symbol name" );
    check( memo.size() <= 256, "memo has more than 256 bytes" );

    stats statstable( get_self(), sym.code().raw() );
    auto existing = statstable.find( sym.code().raw() );
    check( existing != statstable.end(), "token with symbol does not exist" );
    const auto& st = *existing;

    require_auth( st.issuer );
    check( quantity.is_valid(), "invalid quantity" );
    check( quantity.amount > 0, "must retire positive quantity" );

    check( quantity.symbol == st.supply.symbol, "symbol precision mismatch" );

    print("st.supply.amount: ", st.supply.amount, " ");
    print("RETIRE_LIMIT: ", RETIRE_LIMIT.amount, " ");
    print("st.supply > RETIRE_LIMIT: ", st.supply > RETIRE_LIMIT, " ");

   // 销毁到 21000000 时, 不再销毁
   if (quantity.symbol == RETIRE_LIMIT.symbol && st.supply > RETIRE_LIMIT) {
      auto qu = quantity;
      print("st.supply - quantity < RETIRE_LIMIT: ", st.supply - quantity < RETIRE_LIMIT, " ");
      if (st.supply - quantity < RETIRE_LIMIT) {
         qu = st.supply - RETIRE_LIMIT;
      }
      statstable.modify( st, same_payer, [&]( auto& s ) {
       s.supply -= qu;
      });

      sub_balance( st.issuer, qu );
   } else {
      statstable.modify( st, same_payer, [&]( auto& s ) {
       s.supply -= quantity;
      });

      sub_balance( st.issuer, quantity );
   }
}

void token::transfer( const name&    from,
                      const name&    to,
                      const asset&   quantity,
                      const string&  memo )
{
    /***
     * 1. 如果不再交易是时间，只有指定账户可以交易
     * 2. 交易时间内，如果除指定账户外，普通用户不可以互相交易代币
     * 3. 普通用户只能转到固定的几个账户
     */
    check( from != to, "cannot transfer to self" );
    require_auth( from );
    check( is_account( to ), "to account does not exist");
    auto sym = quantity.symbol.code();
    stats statstable( get_self(), sym.raw() );
    const auto& st = statstable.get( sym.raw() );

    require_recipient( from );
    require_recipient( to );

    check( quantity.is_valid(), "invalid quantity" );
    check( quantity.amount > 0, "must transfer positive quantity" );
    check( quantity.symbol == st.supply.symbol, "symbol precision mismatch" );
    check( memo.size() <= 256, "memo has more than 256 bytes" );

    configs conf(get_self(), get_self().value);

    // 查找到 configs 表
    const auto& it = conf.find(get_self().value);
    check( it != conf.end(), "please add configs first" );
    auto from_iter = find(it->admin_name.begin(), it->admin_name.end(), from);
    // 如果 from 是普通用户交易，需要判断交易时间（trade_time）是否在 10 - 21，并且只能转账到 admin 账户
    // 如果 from 是 admin 账户，则不受条件限制，可以自由交易
    if (from_iter != it->admin_name.end()) {
       print("<- configs if ->");
       auto payer = has_auth( to ) ? to : from;

       sub_balance( from, quantity );
       add_balance( to, quantity, payer );
    } else {
       // 拿到当前块的时间戳
       uint32_t count_seconds = current_time_point().sec_since_epoch();
       auto hours_sec = count_seconds % ONE_DAY;
       // 先判断是不是交易时间
       check( hours_sec < TRX_CLOSING_HOURS && hours_sec > TRX_OPENING_HOURS, "The transaction is not open，Please transfer money during trading hours" );
       //  判断是不是转给 admin 账户
       auto to_iter = find(it->admin_name.begin(), it->admin_name.end(), to);
       check( to_iter != it->admin_name.end(), "The transaction was rejected" );
       auto payer = has_auth( to ) ? to : from;
       sub_balance( from, quantity );
       add_balance( to, quantity, payer );
    }
}

void token::sub_balance( const name& owner, const asset& value ) {
   accounts from_acnts( get_self(), owner.value );

   const auto& from = from_acnts.get( value.symbol.code().raw(), "no balance object found" );
   check( from.balance.amount >= value.amount, "overdrawn balance" );

   from_acnts.modify( from, owner, [&]( auto& a ) {
         a.balance -= value;
      });
}

void token::add_balance( const name& owner, const asset& value, const name& ram_payer )
{
   accounts to_acnts( get_self(), owner.value );
   auto to = to_acnts.find( value.symbol.code().raw() );
   if( to == to_acnts.end() ) {
      to_acnts.emplace( ram_payer, [&]( auto& a ){
        a.balance = value;
      });
   } else {
      to_acnts.modify( to, same_payer, [&]( auto& a ) {
        a.balance += value;
      });
   }
}

void token::open( const name& owner, const symbol& symbol, const name& ram_payer )
{
   require_auth( ram_payer );

   check( is_account( owner ), "owner account does not exist" );

   auto sym_code_raw = symbol.code().raw();
   stats statstable( get_self(), sym_code_raw );
   const auto& st = statstable.get( sym_code_raw, "symbol does not exist" );
   check( st.supply.symbol == symbol, "symbol precision mismatch" );

   accounts acnts( get_self(), owner.value );
   auto it = acnts.find( sym_code_raw );
   if( it == acnts.end() ) {
      acnts.emplace( ram_payer, [&]( auto& a ){
        a.balance = asset{0, symbol};
      });
   }
}

void token::close( const name& owner, const symbol& symbol )
{
   require_auth( owner );
   accounts acnts( get_self(), owner.value );
   auto it = acnts.find( symbol.code().raw() );
   check( it != acnts.end(), "Balance row already deleted or never existed. Action won't have any effect." );
   check( it->balance.amount == 0, "Cannot close because the balance is not zero." );
   acnts.erase( it );
}

void token::setconfig( const name& admin, const uint32_t open_time, const uint32_t close_time )
{
   require_auth( get_self() );
   configs conf( get_self(), get_self().value );
   auto it = conf.find( get_self().value );
   conf.modify(it, get_self(), [&]( auto& c ) {
      // 先查找 admin 是否存在表中，存在的话删除，否则添加
      vector<name>::iterator iter = find(c.admin_name.begin(), c.admin_name.end(), admin);
      if (iter != c.admin_name.end()) {
         c.admin_name.erase(iter);
      } else {
	      c.admin_name.push_back(admin);
      }
      c.trx_opening_hours = open_time == 0 ? it->trx_opening_hours : open_time * HOURS_SECONDS;
      c.trx_closing_hours = close_time == 0 ? it->trx_closing_hours : close_time * HOURS_SECONDS;
   });
}

} /// namespace eosio
