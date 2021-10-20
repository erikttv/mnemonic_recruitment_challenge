create table accounts(
	accountId integer not null auto_increment,
	fullName varchar(30) not null,
    availableCash decimal(12,2) not null default 0 check (availableCash >= 0),
	constraint accountspk primary key (accountId)
);

create table transactions(
	transactionId integer not null auto_increment,
    registeredTime long not null,
    executedTime long,
    success boolean,
    cashAmount decimal(12,2) not null check (cashAmount >0),
    sourceAccount integer not null,
    destinationAccount integer not null,
    constraint transactionspk primary key (transactionId),
    constraint transactionsfk1 foreign key (sourceAccount) references accounts(accountId),
    constraint transactionsfk2 foreign key (destinationAccount) references accounts(accountId)
);

insert into accounts(fullName) values ("admin");
insert into accounts(fullName) values ("Erik Thinn Tvedt");
insert into accounts(fullName) values ("Roger Gardshus");
insert into transactions(registeredTime, executedTime, success, cashAmount, sourceAccount, destinationAccount) values
(1634724555593, 1634724555596, 1, 1000, 1, 2);
update accounts set availableCash = availableCash + 1000 where accountId = 2;
insert into transactions(registeredTime, executedTime, success, cashAmount, sourceAccount, destinationAccount) values
(1634724555593, 1634724555596, 1, 500, 1, 3);
update accounts set availableCash = availableCash + 500 where accountId = 3;


