drop schema if exists app;

create schema app;

create table app.account (
    account_id uuid primary key,
    name text,
    email text,
    document text,
    password text
);

create table app.balance (
    account_id uuid,
    asset_id text,
    quantity numeric,
    primary key (account_id, asset_id)
);

create table app.order (
    order_id uuid,
    account_id uuid,
    market_id text,
    side text,
    quantity numeric,
    price numeric,
    fill_quantity numeric,
    fill_price numeric,
    status text,
    timestamp timestamptz,
    primary key (order_id)
);

create table app.trade (
    trade_id uuid,
    market_id text,
    buy_order_id uuid,
    sell_order_id uuid,
    side text,
    quantity numeric,
    price numeric,
    timestamp timestamptz,
    primary key (trade_id)
);
