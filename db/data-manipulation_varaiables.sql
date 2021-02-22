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
VALUES (:user_idInput, :character_nameInput, :character_classInput, :character_traitsInput);

/* § Edit */
UPDATE characters
SET character_class=:characterClassInput, character_traits=:characterTraitsInput
WHERE char_id=6;

/* § Delete */
DELETE FROM characters 
WHERE character_id=:character_idInput;

/* § View All owned by user */
SELECT character_name, character_class, character_traits 
FROM characters 
WHERE user_id=:user_idInput;


/****************************************

		Create Campaign
		
****************************************/

/* § View all campaigns created by a specific Dungeon Master (DM) */
SELECT campaign_name, num_players, desired_history, playstyle, plays_on, created, status
FROM campaigns 
WHERE dm=:user_idInput
ORDER BY status DESC;

/* § Create */
INSERT INTO campaigns(dm, campaign_name, num_players, desired_history, playstyle, plays_on, status) 
VALUES (:dmInput, :campaign_nameInput, :num_playersInput, :desired_historyInput, :playstyleInput, :plays_onInput, :statusInput);

/* § Close a campaign */
UPDATE campaigns 
SET status='Closed'
WHERE campaign_id=:campaign_idInput;


/****************************************

		Available Campaigns
		
****************************************/

/* § View All available campaigns that match <user's> availability */
SELECT *
FROM campaigns
WHERE (
		plays_on=(SELECT IF(monday=1,1,0) FROM user_availability WHERE user_id=:userIdInput)
	OR 	plays_on=(SELECT IF(tuesday=1,2,0) FROM user_availability WHERE user_id=:userIdInput)
	OR 	plays_on=(SELECT IF(wednesday=1,3,0) FROM user_availability WHERE user_id=:userIdInput)
	OR 	plays_on=(SELECT IF(thursday=1,4,0) FROM user_availability WHERE user_id=:userIdInput)
	OR 	plays_on=(SELECT IF(friday=1,5,0) FROM user_availability WHERE user_id=:userIdInput)
	OR 	plays_on=(SELECT IF(saturday=1,6,0) FROM user_availability WHERE user_id=:userIdInput)
	OR 	plays_on=(SELECT IF(sunday=1,7,0) FROM user_availability WHERE user_id=:userIdInput)
		)
	AND status='Open'
ORDER BY created DESC;

/* § Sign Up */
INSERT INTO campaign_player_roster(user_id, campaign_id, character_id) 
VALUES (:user_idInput, :campaign_idInput, :character_idInput);

/* § Leave campaign */
DELETE FROM campaign_player_roster
WHERE user_id=:user_idInput
AND campaign_id=:campaign_idInput;

/* § View All Available Campaigns that are Status->Open */
SELECT 	campaigns.campaign_id,
		campaign_name,
		desired_history, 
		playstyle, 
		IF(plays_on=1,'Monday',IF(plays_on=2,'Tuesday',IF(plays_on=3,'Wednesday',IF(plays_on=4,'Thursday',IF(plays_on=5,'Friday',IF(plays_on=6,'Saturday',IF(plays_on=7,'Sunday',NULL))))))) as 'plays on',
		num_players as 'Looking for',
		the_count as 'Signed up',
		created
FROM campaigns
JOIN (
		select count(campaign_id) as 'the_count', campaign_id
		from campaign_player_roster
		group by campaign_id
	) as campaign_count using (campaign_id)
WHERE status='Open'
ORDER BY created DESC;


/****************************************

		My Availability
		
****************************************/

/* § View */
SELECT * 
FROM user_availability 
WHERE user_id = :userIdInput;

/* § Create (this query runs when a user creates an account) */
INSERT into my_availability(
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
		IF(plays_on=1,'Monday',IF(plays_on=2,'Tuesday',IF(plays_on=3,'Wednesday',IF(plays_on=4,'Thursday',IF(plays_on=5,'Friday',IF(plays_on=6,'Saturday',IF(plays_on=7,'Sunday',NULL))))))) as 'plays on',
		num_players as 'Looking for',
		the_count as 'Signed up',
		created
FROM campaigns
JOIN (
		select count(campaign_id) as 'the_count', campaign_id
		from campaign_player_roster
		where user_id=:user_idInput
		group by campaign_id
	) as campaign_count using (campaign_id)
WHERE status='Open'
ORDER BY created DESC;

/* § Update a user's availability */
UPDATE user_availability
SET monday=:mondayInput, 
	tuesday=:tuesdayInput, 
	wednesday=:wednesdayInput, 
	thursday=:thursdayInput, 
	friday=:fridayInput, 
	saturday=:saturdayInput,
	sunday=:sundayInput
WHERE user_id = :userIdInput;

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
		where user_id=:userIdInput
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