/****************************************

		Group 67
		Project Step 4
		2/15/2021
		
		** This file contains the same queries as "assignmentx_group67_data-manipulation_variables" except that real values are included in place of variable names. These are ready to execute for any Draft Reviewers (or TAs) who want to execute queries directly on the imported tables.
		
		* Note that some delete or update statements are dependent on executing update/insert statements earlier in the section. Enjoy.
		
		Spencer Neukam
		Ethan Hunter

****************************************/


/****************************************

		Characters
		
****************************************/

/* § Create */
INSERT INTO characters(user_id, character_name, character_class, character_traits) 
VALUES (12, 'Regdar', 'Human Fighter', 'Strong willed and capable');

/* § Edit */
UPDATE characters 
SET character_class='Dwarf Fighter', character_traits='Short and capable'
WHERE char_id=6;

/* § Delete */
DELETE FROM characters 
WHERE character_id=6;

/* § View All owned by user */
SELECT character_name, character_class, character_traits 
FROM characters 
WHERE user_id=1;


/****************************************

		Create Campaign
		
****************************************/

/* § View 'Open' campaigns created by a specific Dungeon Master (DM) */
/* Or closed campaigns, just change where clause *?
/* Python requires: DATE_FORMAT(created, '%%b %%e %%Y') as created */
SELECT campaign_id, campaign_name, num_players, desired_history, playstyle, 
	IF(plays_on=1,'Mon',IF(plays_on=2,'Tues',IF(plays_on=3,'Wed',IF(plays_on=4,'Thur',IF(plays_on=5,'Fri',IF(plays_on=6,'Sat',IF(plays_on=7,'Sun',NULL))))))) as 'plays_on',
	DATE_FORMAT(created,'%b %e %Y') as created, status, COUNT(campaign_id) as signed_up
FROM campaigns
LEFT JOIN campaign_player_roster using (campaign_id)
WHERE dm=2
AND status='Open'
GROUP BY campaign_id
ORDER BY created ASC;

/* § Create */
INSERT INTO campaigns(dm, campaign_name, num_players, desired_history, playstyle, plays_on, created, status) 
VALUES (2, 'A New Campaign', 5, 'Some experience', 'UA Allowed', 6, curdate(), 'Open');

/* § Close a campaign */
UPDATE campaigns 
SET status='Closed'
WHERE campaign_id=7
AND dm=2;

/* View Roster for a campaign */



/****************************************

		Available Campaigns
		
****************************************/

/* no longer needed */
/* § View All available campaigns that match <user's> availability
SELECT *
FROM campaigns
WHERE (
		plays_on=(SELECT IF(monday=1,1,0) FROM user_availability WHERE user_id=1)
	OR 	plays_on=(SELECT IF(tuesday=1,2,0) FROM user_availability WHERE user_id=1)
	OR 	plays_on=(SELECT IF(wednesday=1,3,0) FROM user_availability WHERE user_id=1)
	OR 	plays_on=(SELECT IF(thursday=1,4,0) FROM user_availability WHERE user_id=1)
	OR 	plays_on=(SELECT IF(friday=1,5,0) FROM user_availability WHERE user_id=1)
	OR 	plays_on=(SELECT IF(saturday=1,6,0) FROM user_availability WHERE user_id=1)
	OR 	plays_on=(SELECT IF(sunday=1,7,0) FROM user_availability WHERE user_id=1)
		)
	AND status='Open'
ORDER BY created ASC; */

/* § View all available campaigns that match <user's> availability. Include whether {user_id}  is signed up for that campaign. */
SELECT 	campaigns.campaign_id,
		campaign_name,
        desired_history,
        playstyle,
     IF(plays_on=1,'Monday',IF(plays_on=2,'Tuesday',IF(plays_on=3,'Wednesday',IF(plays_on=4,'Thursday',IF(plays_on=5,'Friday',IF(plays_on=6,'Saturday',IF(plays_on=7,'Sunday',NULL))))))) as 'plays_on',
        num_players as 'looking_for',
		IFNULL(the_count, 0) as 'signed_up',
		DATE_FORMAT(created,'%b %e %Y'),
        IF(participation.signed_up_for='1',1,0) as 'signed_up_for'
FROM campaigns
LEFT JOIN (
    	/* Need to join this table to get 'the_count' column of count of players signed up */
		select count(campaign_id) as 'the_count', campaign_id
		from campaign_player_roster
		group by campaign_id
	) as campaign_count using (campaign_id)
LEFT JOIN (
    	/* Join on campaigns the user has signed up for: campaign_id, signed_up_for (0/1) */
            SELECT 	campaigns.campaign_id,
					"1" as signed_up_for
			FROM campaigns
			JOIN (
				select count(campaign_id) as 'the_count', campaign_id
				from campaign_player_roster
				where user_id=1
				group by campaign_id
			) as campaign_count using (campaign_id)
			WHERE status='Open'
			ORDER BY created DESC			
	) as participation using (campaign_id)
WHERE (
		plays_on=(SELECT IF(monday=1,1,0) FROM user_availability WHERE user_id=1)
	OR 	plays_on=(SELECT IF(tuesday=1,2,0) FROM user_availability WHERE user_id=1)
	OR 	plays_on=(SELECT IF(wednesday=1,3,0) FROM user_availability WHERE user_id=1)
	OR 	plays_on=(SELECT IF(thursday=1,4,0) FROM user_availability WHERE user_id=1)
	OR 	plays_on=(SELECT IF(friday=1,5,0) FROM user_availability WHERE user_id=1)
	OR 	plays_on=(SELECT IF(saturday=1,6,0) FROM user_availability WHERE user_id=1)
	OR 	plays_on=(SELECT IF(sunday=1,7,0) FROM user_availability WHERE user_id=1)
		)
	AND status='Open'
ORDER BY signed_up_for DESC, created ASC;

/* § Sign Up */
INSERT INTO campaign_player_roster(user_id, campaign_id, character_id) 
VALUES (1, 6, 2);

/* § Leave campaign */
DELETE FROM campaign_player_roster
WHERE user_id=1
AND campaign_id=6;

/* § View All Available Campaigns that are Status->Open */
SELECT 	campaigns.campaign_id,
		campaign_name,
		desired_history, 
		playstyle, 
		IF(plays_on=1,'Monday',IF(plays_on=2,'Tuesday',IF(plays_on=3,'Wednesday',IF(plays_on=4,'Thursday',IF(plays_on=5,'Friday',IF(plays_on=6,'Saturday',IF(plays_on=7,'Sunday',NULL))))))) as 'plays_on',
		num_players as 'looking_for',
		IFNULL(the_count,0) as 'signed_up',
		DATE_FORMAT(created,'%b %e %Y') as created  /* Python requires: DATE_FORMAT(created, '%%b %%e %%Y') as created */
FROM campaigns
LEFT JOIN (
		select count(campaign_id) as 'the_count', campaign_id
		from campaign_player_roster
		group by campaign_id
	) as campaign_count using (campaign_id)
WHERE status='Open'
ORDER BY created ASC;


/* View all open campaigns, how many users are signed up for that campaign, and if the current user is signed up for the campaign */
SELECT 	campaigns.campaign_id,
		campaign_name,
        desired_history,
        playstyle,
     IF(plays_on=1,'Monday',IF(plays_on=2,'Tuesday',IF(plays_on=3,'Wednesday',IF(plays_on=4,'Thursday',IF(plays_on=5,'Friday',IF(plays_on=6,'Saturday',IF(plays_on=7,'Sunday',NULL))))))) as 'plays on',
        num_players as 'Looking for',
		the_count as 'Signed up',
		DATE_FORMAT(created,'%b %e %Y') /* Python requires: DATE_FORMAT(created, '%%b %%e %%Y') as created */
        IF(participation.signed_up_for='1',1,0) as 'signed_up_for'
FROM campaigns
JOIN (
    	/* Need to join this table to get 'the_count' column of count of players signed up */
		select count(campaign_id) as 'the_count', campaign_id
		from campaign_player_roster
		group by campaign_id
	) as campaign_count using (campaign_id)
LEFT JOIN (
    	/* Join on campaigns the user has signed up for: campaign_id, signed_up_for (0/1) */
		
            SELECT 	campaigns.campaign_id,
					"1" as signed_up_for
			FROM campaigns
			JOIN (
				select count(campaign_id) as 'the_count', campaign_id
				from campaign_player_roster
				where user_id=7
				group by campaign_id
			) as campaign_count using (campaign_id)
			WHERE status='Open'
			ORDER BY created DESC
			
			
	) as participation using (campaign_id)
WHERE (
		plays_on=(SELECT IF(monday=1,1,0) FROM user_availability WHERE user_id=7)
	OR 	plays_on=(SELECT IF(tuesday=1,2,0) FROM user_availability WHERE user_id=7)
	OR 	plays_on=(SELECT IF(wednesday=1,3,0) FROM user_availability WHERE user_id=7)
	OR 	plays_on=(SELECT IF(thursday=1,4,0) FROM user_availability WHERE user_id=7)
	OR 	plays_on=(SELECT IF(friday=1,5,0) FROM user_availability WHERE user_id=7)
	OR 	plays_on=(SELECT IF(saturday=1,6,0) FROM user_availability WHERE user_id=7)
	OR 	plays_on=(SELECT IF(sunday=1,7,0) FROM user_availability WHERE user_id=7)
		)
	AND status='Open'
ORDER BY signed_up_for DESC, created ASC;

/* TODO - Set a Campaign to Closed given Campaign ID, if signed up = looking for */
/******/


/****************************************

		My Availability
		
****************************************/

/* § View */
SELECT * 
FROM user_availability 
WHERE user_id = 1;

/* § Create (this query runs when a user creates an account) */
INSERT into user_availability(
	user_id, 
	monday, 
	tuesday, 
	wednesday, 
	thursday, 
	friday, 
	saturday, 
	sunday)
VALUES(5, 1, 1, 1, 1, 1, 1, 1);

/* § View Campaigns that a particular user is signed up for */
SELECT 	campaigns.campaign_id,
		campaign_name,
        desired_history,
        playstyle,
		IF(plays_on=1,'Monday',IF(plays_on=2,'Tuesday',IF(plays_on=3,'Wednesday',IF(plays_on=4,'Thursday',IF(plays_on=5,'Friday',IF(plays_on=6,'Saturday',IF(plays_on=7,'Sunday',NULL))))))) as 'plays_on',
        num_players as 'looking_for',
		the_count as 'signed_up',
		DATE_FORMAT(created,'%b %e %Y'),   /* Python requires: DATE_FORMAT(created, '%%b %%e %%Y') as created */
        campaigns_signed_up_for.user_id
FROM campaigns
JOIN (
    	/* join this table to get 'the_count' column of count of players signed up */
		select count(campaign_id) as 'the_count', campaign_id
		from campaign_player_roster
		group by campaign_id
	) as campaign_count using (campaign_id)
LEFT JOIN (
		/* join this table to ascertain whether our user is signed up for the campaign */
		select campaign_id, user_id
		from campaign_player_roster
    	where user_id = 7
	) as campaigns_signed_up_for using (campaign_id)
WHERE (
    	(
		plays_on=(SELECT IF(monday=1,1,0) FROM user_availability WHERE user_id=7)
	OR 	plays_on=(SELECT IF(tuesday=1,2,0) FROM user_availability WHERE user_id=7)
	OR 	plays_on=(SELECT IF(wednesday=1,3,0) FROM user_availability WHERE user_id=7)
	OR 	plays_on=(SELECT IF(thursday=1,4,0) FROM user_availability WHERE user_id=7)
	OR 	plays_on=(SELECT IF(friday=1,5,0) FROM user_availability WHERE user_id=7)
	OR 	plays_on=(SELECT IF(saturday=1,6,0) FROM user_availability WHERE user_id=7)
	OR 	plays_on=(SELECT IF(sunday=1,7,0) FROM user_availability WHERE user_id=7)
		)
	AND status='Open')
	AND user_id = 7
ORDER BY created ASC

/* § Update a user's availability */
UPDATE user_availability
SET monday=0, 
	tuesday=1, 
	wednesday=1, 
	thursday=1, 
	friday=0, 
	saturday=1,
	sunday=1
WHERE user_id = 3;

/* § Drop a user from a campaign based on their updated availability 
		i.e. If a user was signed up for a Monday/Tuesday campaign(s), and they 
		removed themselves as available on Mondays/Tuesdays, the query will
		remove them from all campaigns (if any) they were a part of on Mon/Tues.
		
		If you updated userID 3's availability above, it removed them as available on Fridays and Mondays, the days they are signed up to play campaigns on. This query will remove them having signed up for those campaigns.
		
		After this query, re-run the "View campaigns that a particular user is
		signed up for" query. You should see 0 results returned. */
delete from campaign_player_roster
where campaign_player_id in (
	select remove_from_campaign.campaign_player_id
	from (
		select *
		from campaign_player_roster
		left join user_availability using(user_id)
		join campaigns using(campaign_id)
		where user_id=3
		and (
				plays_on!=(SELECT IF(monday=1,1,0) FROM user_availability WHERE user_id=3)
			AND plays_on!=(SELECT IF(tuesday=1,2,0) FROM user_availability WHERE user_id=3)
			AND plays_on!=(SELECT IF(wednesday=1,3,0) FROM user_availability WHERE user_id=3)
			AND plays_on!=(SELECT IF(thursday=1,4,0) FROM user_availability WHERE user_id=3)
			AND plays_on!=(SELECT IF(friday=1,5,0) FROM user_availability WHERE user_id=3)
			AND plays_on!=(SELECT IF(saturday=1,6,0) FROM user_availability WHERE user_id=3)
			AND plays_on!=(SELECT IF(sunday=1,7,0) FROM user_availability WHERE user_id=3)
			)
		and status='Open'
    ) as remove_from_campaign
)


/****************************************

		Account
		
****************************************/

/* § View account information for a specific user */
SELECT *
FROM users
WHERE user_id = 5;

/* § Create account */
INSERT INTO users(username, password, email, name, player_type, playstyle, campaign_history)
VALUES ('sneukam', '12345', 'spencer.neukam@gmail.com', 'Spencer Neukam', 'Player', 'Aggro', '0 camps.');

/* § Update */
UPDATE users
SET username='neukams',
	password='45678', 
	email='neukams@oregonstate.edu', 
	name='Spencer Neukam', 
	playstyle='Passive', 
	campaign_history="1 campaign. Aggro didn't work out."
WHERE
	user_id = 17;