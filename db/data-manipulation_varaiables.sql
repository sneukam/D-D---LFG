/****************************************

		Group 67
		Project Step 4
		2/15/2021
		
		CRUD Queries
		**Variables in queries are denoted with a semicolon ":" and an appended 'Input' to the var name.
		
		Spencer Neukam
		Ethan Hunter

****************************************/


/****************************************

		Characters
		
****************************************/

/* § Create */
INSERT INTO characters(user_id, character_name, character_class, character_traits) 
VALUES ({user_id}, {name}, {chrctr_class}, {traits});

/* § Edit */
UPDATE characters
SET character_name={name}, character_class={chrctr_class}, character_traits={traits}
WHERE char_id={character_id};

/* § Delete */
DELETE FROM characters 
WHERE character_id={character_id};

/* § View All owned by user */
SELECT character_id, character_name, character_class, character_traits 
FROM characters 
WHERE user_id={user_id};


/****************************************

		Create Campaign
		
****************************************/

/* § View 'Open' (or Closed) campaigns created by a specific Dungeon Master (DM) */
/* Python requires: DATE_FORMAT(created, '%%b %%e %%Y') as created */
SELECT campaign_id, campaign_name, num_players, desired_history, playstyle, 
IF(plays_on=1,'Mon',IF(plays_on=2,'Tues',IF(plays_on=3,'Wed',IF(plays_on=4,'Thur',IF(plays_on=5,'Fri',IF(plays_on=6,'Sat',IF(plays_on=7,'Sun',NULL))))))) as 'plays_on',
	DATE_FORMAT(created,'%b %e %Y') as created, status, DATE_FORMAT(closed,'%b %e %Y') as closed, IFNULL(the_count,0) as 'signed_up'
FROM campaigns
LEFT JOIN campaign_player_roster using (campaign_id)
LEFT JOIN (
    SELECT campaign_id, COUNT(campaign_id) as 'the_count'
    FROM campaign_player_roster
    GROUP BY campaign_id
) as id_count using (campaign_id)
WHERE dm={user_id}
AND status={status}
GROUP BY campaign_id
ORDER BY created ASC

/* § Create */
INSERT INTO campaigns(dm, campaign_name, num_players, desired_history, playstyle, plays_on, created, status) 
VALUES (2, 'A New Campaign', 5, 'Some experience', 'UA Allowed', 6, curdate(), 'Open');

/* § Close a campaign */
UPDATE campaigns 
SET status='Closed', closed=CURDATE()
WHERE campaign_id={campaign_id}
AND dm={dm_id};

/* View Roster for a Campaign */
SELECT campaign_id, campaign_name, users.username, users.email, users.name, users.player_type, users.playstyle, users.campaign_history, characters.character_name, characters.character_class, characters.character_traits
FROM campaign_player_roster as r
LEFT JOIN users using (user_id)
LEFT JOIN characters on r.character_id = characters.character_id
LEFT JOIN campaigns using (campaign_id)
WHERE r.campaign_id = {campaign_id}
AND player_type = 'Player'


/****************************************

		Available Campaigns
		
****************************************/

/* I don't think this one is needed any more */
/* § View All available campaigns that match <user's> availability 
SELECT *
FROM campaigns
WHERE (
		plays_on=(SELECT IF(monday=1,1,0) FROM user_availability WHERE user_id=:{user_id})
	OR 	plays_on=(SELECT IF(tuesday=1,2,0) FROM user_availability WHERE user_id=:{user_id})
	OR 	plays_on=(SELECT IF(wednesday=1,3,0) FROM user_availability WHERE user_id=:{user_id})
	OR 	plays_on=(SELECT IF(thursday=1,4,0) FROM user_availability WHERE user_id=:{user_id})
	OR 	plays_on=(SELECT IF(friday=1,5,0) FROM user_availability WHERE user_id=:{user_id})
	OR 	plays_on=(SELECT IF(saturday=1,6,0) FROM user_availability WHERE user_id=:{user_id})
	OR 	plays_on=(SELECT IF(sunday=1,7,0) FROM user_availability WHERE user_id=:{user_id})
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
				where user_id={user_id}
				group by campaign_id
			) as campaign_count using (campaign_id)
			WHERE status='Open'
			ORDER BY created DESC			
	) as participation using (campaign_id)
WHERE (
		plays_on=(SELECT IF(monday=1,1,0) FROM user_availability WHERE user_id={user_id})
	OR 	plays_on=(SELECT IF(tuesday=1,2,0) FROM user_availability WHERE user_id={user_id})
	OR 	plays_on=(SELECT IF(wednesday=1,3,0) FROM user_availability WHERE user_id={user_id})
	OR 	plays_on=(SELECT IF(thursday=1,4,0) FROM user_availability WHERE user_id={user_id})
	OR 	plays_on=(SELECT IF(friday=1,5,0) FROM user_availability WHERE user_id={user_id})
	OR 	plays_on=(SELECT IF(saturday=1,6,0) FROM user_availability WHERE user_id={user_id})
	OR 	plays_on=(SELECT IF(sunday=1,7,0) FROM user_availability WHERE user_id={user_id})
		)
	AND status='Open'
ORDER BY signed_up_for DESC, created ASC;

/* § Sign Up (Join Campaign) */
INSERT INTO campaign_player_roster(user_id, campaign_id, character_id)
VALUES ({user_id}, {campaign_id}, {character_id});

/* § Leave campaign */
DELETE FROM campaign_player_roster
WHERE user_id={user_id}
AND campaign_id={campaign_id};

/* § View All Available Campaigns that are Status->Open */
SELECT 	campaigns.campaign_id,
		campaign_name,
		desired_history, 
		playstyle, 
		IF(plays_on=1,'Monday',IF(plays_on=2,'Tuesday',IF(plays_on=3,'Wednesday',IF(plays_on=4,'Thursday',IF(plays_on=5,'Friday',IF(plays_on=6,'Saturday',IF(plays_on=7,'Sunday',NULL))))))) as 'plays on',
		num_players as 'Looking for',
		IFNULL(the_count,0) as 'signed_up',
		DATE_FORMAT(created,'%b %e %Y')
FROM campaigns
LEFT JOIN (
		select count(campaign_id) as 'the_count', campaign_id
		from campaign_player_roster
		group by campaign_id
	) as campaign_count using (campaign_id)
WHERE status='Open'
ORDER BY created ASC;


/****************************************

		My Availability
		
****************************************/

/* § View a user's availability*/
SELECT * 
FROM user_availability 
WHERE user_id = {user_id};

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
VALUES(:user_idInput, 
	:mondayInput, 
	:tuesdayInput, 
	:wednesdayInput, 
	:thursdayInput, 
	:fridayInput, 
	:saturdayInput, 
	:sundayInput);

/* § View Campaigns that a particular user is signed up for */
SELECT 	campaigns.campaign_id,
		campaign_name,
        desired_history,
        playstyle,
		IF(plays_on=1,'Monday',IF(plays_on=2,'Tuesday',IF(plays_on=3,'Wednesday',IF(plays_on=4,'Thursday',IF(plays_on=5,'Friday',IF(plays_on=6,'Saturday',IF(plays_on=7,'Sunday',NULL))))))) AS 'plays_on',
        num_players as 'looking_for',
		the_count as 'signed_up',
		DATE_FORMAT(created,'%b %e %Y'),   /* Python requires: DATE_FORMAT(created, '%%b %%e %%Y') as created */
        campaigns_signed_up_for.user_id
FROM campaigns
JOIN (
    	/* join this table to get 'the_count' column of count of players signed up */
		SELECT COUNT(campaign_id) AS 'the_count', campaign_id
		FROM campaign_player_roster
		GROUP BY campaign_id
	) AS campaign_count USING (campaign_id)
LEFT JOIN (
		/* join this table to ascertain whether our user is signed up for the campaign */
		SELECT campaign_id, user_id
		FROM campaign_player_roster
    	WHERE user_id = {user_id}
	) AS campaigns_signed_up_for USING (campaign_id)
WHERE (
    	(
		plays_on=(SELECT IF(monday=1,1,0) FROM user_availability WHERE user_id={user_id})
	OR 	plays_on=(SELECT IF(tuesday=1,2,0) FROM user_availability WHERE user_id={user_id})
	OR 	plays_on=(SELECT IF(wednesday=1,3,0) FROM user_availability WHERE user_id={user_id})
	OR 	plays_on=(SELECT IF(thursday=1,4,0) FROM user_availability WHERE user_id={user_id})
	OR 	plays_on=(SELECT IF(friday=1,5,0) FROM user_availability WHERE user_id={user_id})
	OR 	plays_on=(SELECT IF(saturday=1,6,0) FROM user_availability WHERE user_id={user_id})
	OR 	plays_on=(SELECT IF(sunday=1,7,0) FROM user_availability WHERE user_id={user_id})
		)
	AND status='Open')
	AND user_id = {user_id}
ORDER BY created ASC

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
		where user_id={user_id}
		and (
				plays_on!=(SELECT IF(monday=1,1,0) FROM user_availability WHERE user_id={user_id})
			AND plays_on!=(SELECT IF(tuesday=1,2,0) FROM user_availability WHERE user_id={user_id})
			AND plays_on!=(SELECT IF(wednesday=1,3,0) FROM user_availability WHERE user_id={user_id})
			AND plays_on!=(SELECT IF(thursday=1,4,0) FROM user_availability WHERE user_id={user_id})
			AND plays_on!=(SELECT IF(friday=1,5,0) FROM user_availability WHERE user_id={user_id})
			AND plays_on!=(SELECT IF(saturday=1,6,0) FROM user_availability WHERE user_id={user_id})
			AND plays_on!=(SELECT IF(sunday=1,7,0) FROM user_availability WHERE user_id={user_id})
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
WHERE user_id = :userIdInput;

/* § Create account */
INSERT INTO users(username, password, email, name, player_type, playstyle, campaign_history)
VALUES (:usernameInput, :passwordInput, :emailInput, :nameInput, :player_typeInput, :playstyleInput, :campaign_historyInput);

/* § Update */
UPDATE users
SET username=:usernameInput,
	password=:passwordInput, 
	email=:emailInput, 
	name=:nameInput, 
	playstyle=:playstyleInput, 
	campaign_history=:campaign_historyInput
WHERE
	user_id = :useridInput;