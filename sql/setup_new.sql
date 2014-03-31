/*
 *  File name:  setup.sql
 *  Function:   to create the initial database schema for the CMPUT 391 project,
 *              WINTer Term, 2014
 *  Author:     Prof. Li-Yan Yuan
 */

 /*
 * MYSQL requires MYISAM engine for fulltext unless above version 5.6
 */

DROP TABLE family_doctor;
DROP TABLE pacs_images;
DROP TABLE radiology_record;
DROP TABLE users;
DROP TABLE persons;

/*
 *  To store the personal information
 */
CREATE TABLE persons (
   person_id INT,
   first_name varchar(24),
   last_name  varchar(24),
   address    varchar(128),
   email      varchar(128),
   phone      char(10),
   PRIMARY KEY(person_id),
   UNIQUE (email)
) ENGINE=MyISAM;

/*
 *  To store the log-in information
 *  Note that a person may have been assigned different user_name(s), depending
 *  on his/her role in the log-in  
 */
CREATE TABLE users (
   user_name varchar(24),
   password  varchar(24),
   class     char(1),
   person_id INT,
   date_registered date,
   CHECK (class in ('a','p','d','r')),
   PRIMARY KEY(user_name),
   FOREIGN KEY (person_id) REFERENCES persons (person_id)
) ENGINE=MyISAM;

/*
 *  to indicate who is whose family doctor.
 */
CREATE TABLE family_doctor (
   doctor_id    INT,
   patient_id   INT,
   FOREIGN KEY(doctor_id) REFERENCES persons (person_id),
   FOREIGN KEY(patient_id) REFERENCES persons (person_id),
   PRIMARY KEY(doctor_id,patient_id)
) ENGINE=MyISAM;

/*
 *  to store the radiology records
 */
CREATE TABLE radiology_record (
   record_id   INT,
   patient_id  INT,
   doctor_id   INT,
   radiologist_id INT,
   test_type   varchar(24),
   prescribing_date date,
   test_date    date,
   diagnosis    varchar(128),
   description   varchar(1024),
   PRIMARY KEY(record_id),
   FOREIGN KEY(patient_id) REFERENCES persons (person_id),
   FOREIGN KEY(doctor_id) REFERENCES  persons (person_id),
   FOREIGN KEY(radiologist_id) REFERENCES  persons (person_id)
) ENGINE=MyISAM;

/*
 *  to store the pacs images
 */
CREATE TABLE pacs_images (
   record_id   INT,
   image_id    INT,
   thumbnail   LONGBLOB,
   regular_size LONGBLOB,
   full_size    LONGBLOB,
   PRIMARY KEY(record_id,image_id),
   FOREIGN KEY(record_id) REFERENCES radiology_record (record_id)
) ENGINE=MyISAM;

/* create cube view */
DROP VIEW cube;
CREATE VIEW cube as SELECT radiology_record.record_id,radiology_record.patient_id,pacs_images.image_id,radiology_record.test_type,radiology_record.test_date FROM radiology_record LEFT JOIN pacs_images ON radiology_record.record_id = pacs_images.record_id;

/* create default admin account
 * Account will be admin/admin to login
 * From here the admin can create other persons and users.
 */
INSERT INTO persons values(1,'Admin First Name','Admin Last Name','','admin@email.com','5555555555');
INSERT INTO users values('admin','admin','a',1,CURDATE());

/* needed for fulltext search */
create fulltext index searchRadio on radiology_record(diagnosis,description);
create fulltext index searchRadioDiag on radiology_record(diagnosis);
create fulltext index searchRadioDesc on radiology_record(description);
create fulltext index searchPerson on persons(first_name,last_name);
