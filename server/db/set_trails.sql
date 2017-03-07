DROP TABLE IF EXISTS testTable, testTable2;

CREATE TABLE testTable (
    ID SERIAL PRIMARY KEY,
    test1 INTEGER,
    test2 INTEGER
);

CREATE TABLE testTable2 (
    ID SERIAL PRIMARY KEY,
    test3 INTEGER,
    test4 INTEGER,
    testTable_ID INTEGER
);

INSERT INTO testTable (test1, test2) VALUES (1, 2);
INSERT INTO testTable (test1, test2) VALUES (1, 2);
INSERT INTO testTable (test1, test2) VALUES (1, 2);
INSERT INTO testTable (test1, test2) VALUES (1, 2);
INSERT INTO testTable (test1, test2) VALUES (1, 2);
INSERT INTO testTable (test1, test2) VALUES (1, 2);
INSERT INTO testTable (test1, test2) VALUES (1, 2);
INSERT INTO testTable (test1, test2) VALUES (1, 2);

INSERT INTO testTable2 (test3, test4, testTable_ID) VALUES (3, 4, 1);
INSERT INTO testTable2 (test3, test4, testTable_ID) VALUES (3, 4, 1);
INSERT INTO testTable2 (test3, test4, testTable_ID) VALUES (3, 4, 1);
INSERT INTO testTable2 (test3, test4, testTable_ID) VALUES (3, 4, 1);
INSERT INTO testTable2 (test3, test4, testTable_ID) VALUES (3, 4, 3);
INSERT INTO testTable2 (test3, test4, testTable_ID) VALUES (3, 4, 3);
INSERT INTO testTable2 (test3, test4, testTable_ID) VALUES (3, 4, 4);
INSERT INTO testTable2 (test3, test4, testTable_ID) VALUES (3, 4, 4);
INSERT INTO testTable2 (test3, test4, testTable_ID) VALUES (3, 4, 1);



