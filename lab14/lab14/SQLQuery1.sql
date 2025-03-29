USE [univer_db];
GO

CREATE LOGIN [user_js] 
WITH PASSWORD = '123QWEasdzxc';
GO

USE [univer_db];
GO

CREATE USER [user_1] FOR LOGIN [user_js];
GO

ALTER ROLE [db_owner] ADD MEMBER [user_1];
GO


SELECT name, is_disabled
FROM sys.sql_logins
WHERE name = 'user_js';

ALTER LOGIN [user_js] WITH PASSWORD = '123QWEasdzxc!';
