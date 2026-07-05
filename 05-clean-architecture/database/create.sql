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