drop schema if exists app;

create schema app;

create table app.account (
    account_id uuid primary key,
    name text,
    email text,
    document text,
    password text
);
