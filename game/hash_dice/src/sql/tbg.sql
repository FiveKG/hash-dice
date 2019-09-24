CREATE USER hash_dice_user WITH PASSWORD 'pass_2019';
CREATE DATABASE hash_dice OWNER hash_dice_user;
grant select,insert,update,delete on all tables in schema public to hash_dice_user; 
grant select,usage,update on all sequences in schema public to hash_dice_user;
grant execute on all functions in schema public to hash_dice_user;
grant references, trigger on all tables in schema public to hash_dice_user;
grant create on schema public to hash_dice_user;
grant usage on schema public to hash_dice_user;