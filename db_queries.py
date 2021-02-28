"""
This file holds the database queries for the D&D LFG website.
Each query is contained within its own function.
Call a function to return the desired query
All functions return: string
"""

"""
-------------------------------------------
        Available Campaigns Page
-------------------------------------------
"""


def view_campaigns_matching_user_availability(user_id):
    """
    View all campaigns that match a user's availability
    """

    return f"   SELECT campaigns.campaign_id, \
                    campaign_name, \
                    desired_history, \
                    playstyle, \
                    IF(plays_on=1, 'Monday', \
                        IF(plays_on=2, 'Tuesday', \
                        IF(plays_on=3, 'Wednesday', \
                        IF(plays_on=4,'Thursday', \
                        IF(plays_on=5, 'Friday', \
                        IF(plays_on=6, 'Saturday', \
                        IF(plays_on=7, 'Sunday', NULL))))))) as 'plays_on',\
                    num_players as 'looking_for', \
                    IFNULL(the_count, 0) as 'signed_up', \
                    DATE_FORMAT(created, '%%b %%e %%Y') as created, \
                    IF(participation.signed_up_for = '1', 1, 0) as 'signed_up_for' \
                FROM \
                    campaigns \
                LEFT JOIN( \
                        SELECT \
                            count(campaign_id) as 'the_count', \
                            campaign_id \
                        FROM \
                            campaign_player_roster \
                        GROUP BY campaign_id \
                    ) as campaign_count using(campaign_id) \
                LEFT JOIN( \
                        SELECT \
                            campaigns.campaign_id, \
                            '1' as signed_up_for \
                        FROM \
                            campaigns \
                        JOIN( \
                                SELECT \
                                    count(campaign_id) as 'the_count', \
                                    campaign_id \
                                FROM \
                                    campaign_player_roster \
                                WHERE \
                                    user_id = {user_id} \
                                GROUP BY campaign_id \
                            ) as campaign_count using(campaign_id) \
                        WHERE \
                            status = 'Open' \
                        ORDER BY \
                            created DESC \
                    ) as participation using(campaign_id) \
                WHERE ( \
                        plays_on=(SELECT IF(monday=1, 1, 0) FROM user_availability WHERE user_id = {user_id}) \
                    OR  plays_on = (SELECT IF(tuesday=1, 2, 0) FROM user_availability WHERE user_id = {user_id}) \
                    OR  plays_on = (SELECT IF(wednesday=1, 3, 0) FROM user_availability WHERE user_id = {user_id}) \
                    OR  plays_on = (SELECT IF(thursday=1, 4, 0) FROM user_availability WHERE user_id = {user_id}) \
                    OR  plays_on = (SELECT IF(friday=1, 5, 0) FROM user_availability WHERE user_id = {user_id}) \
                    OR  plays_on = (SELECT IF(saturday=1, 6, 0) FROM user_availability WHERE user_id = {user_id}) \
                    OR  plays_on = (SELECT IF(sunday=1, 7, 0) FROM user_availability WHERE user_id = {user_id}) \
                    ) \
                    AND status = 'Open' \
                ORDER BY signed_up_for DESC, created ASC;"


def view_open_campaigns():
    """
    View all open campaigns
    """

    return "SELECT 	campaigns.campaign_id, \
                    campaign_name, \
                    desired_history, \
                    playstyle, \
                    IF(plays_on=1,'Monday',\
                        IF(plays_on=2,'Tuesday',\
                        IF(plays_on=3,'Wednesday',\
                        IF(plays_on=4,'Thursday',\
                        IF(plays_on=5,'Friday',\
                        IF(plays_on=6,'Saturday',\
                        IF(plays_on=7,'Sunday',NULL))))))) as 'plays_on', \
                    num_players as 'looking_for', \
                    IFNULL(the_count,0) as 'signed_up', \
                    DATE_FORMAT(created, '%%b %%e %%Y') as created \
            FROM campaigns \
            LEFT JOIN ( \
                select count(campaign_id) as 'the_count', campaign_id \
                from campaign_player_roster \
                group by campaign_id \
            ) as campaign_count using (campaign_id) \
            WHERE status='Open' \
            ORDER BY created ASC;"


def join_campaign(user_id, campaign_id, character_id):
    return f"   INSERT INTO campaign_player_roster(user_id, campaign_id, character_id) \
                VALUES({user_id}, {campaign_id}, {character_id});"

def leave_campaign(user_id, campaign_id):
    return f"DELETE FROM campaign_player_roster WHERE user_id={user_id} AND campaign_id={campaign_id};"


"""
-------------------------------------------
        My Availability Page
-------------------------------------------
"""

def view_campaigns_user_signed_up_for(user_id):
    """
    returns a query for campaigns that a user is signed up for, where the campaign is still 'Open'
    """

    return f"   SELECT \
                    campaigns.campaign_id, \
                    campaign_name, \
                    desired_history, \
                    playstyle, \
                    IF(plays_on=1,'Monday', \
                        IF(plays_on=2,'Tuesday', \
                        IF(plays_on=3,'Wednesday', \
                        IF(plays_on=4,'Thursday', \
                        IF(plays_on=5,'Friday', \
                        IF(plays_on=6,'Saturday', \
                        IF(plays_on=7,'Sunday',NULL))))))) as 'plays_on', \
                    num_players as 'looking_for', \
                    the_count as 'signed_up', \
                    DATE_FORMAT(created,'%%b %%e %%Y'), \
                    campaigns_signed_up_for.user_id \
                FROM \
                    campaigns \
                JOIN ( \
                    SELECT count(campaign_id) as 'the_count', campaign_id \
                    FROM campaign_player_roster \
                    GROUP BY campaign_id \
                    ) as campaign_count using (campaign_id) \
                LEFT JOIN ( \
                    SELECT campaign_id, user_id \
                    FROM campaign_player_roster \
                    WHERE user_id = {user_id} \
                ) as campaigns_signed_up_for using (campaign_id) \
                WHERE ( \
                    ( \
                        plays_on=(SELECT IF(monday=1,1,0) FROM user_availability WHERE user_id={user_id}) \
                        OR 	plays_on=(SELECT IF(tuesday=1,2,0) FROM user_availability WHERE user_id={user_id}) \
                        OR 	plays_on=(SELECT IF(wednesday=1,3,0) FROM user_availability WHERE user_id={user_id}) \
                        OR 	plays_on=(SELECT IF(thursday=1,4,0) FROM user_availability WHERE user_id={user_id}) \
                        OR 	plays_on=(SELECT IF(friday=1,5,0) FROM user_availability WHERE user_id={user_id}) \
                        OR 	plays_on=(SELECT IF(saturday=1,6,0) FROM user_availability WHERE user_id={user_id}) \
                        OR 	plays_on=(SELECT IF(sunday=1,7,0) FROM user_availability WHERE user_id={user_id}) \
                    ) \
                    AND status='Open') \
                    AND user_id = {user_id} \
                ORDER BY created ASC"

def view_my_availability(user_id):
    """
    returns a query for a given user's availability
    """

    return f"SELECT * FROM user_availability WHERE user_id = {user_id};"

def update_my_availability(user_id, availability):
    """
    updates a user's availability
    availability: JSON object
        ex: {monday:1, tuesday:0, wednesday:1, ...}
    """

    return f"   UPDATE \
                    user_availability \
                SET \
                    monday={availability['monday']}, \
	                tuesday={availability['tuesday']}, \
	                wednesday={availability['wednesday']}, \
	                thursday={availability['thursday']}, \
	                friday={availability['friday']}, \
	                saturday={availability['saturday']}, \
	                sunday={availability['sunday']} \
	            WHERE \
	                user_id={user_id};"

def delete_user_from_campaign_if_availability_removed(user_id):
    """
    delete's a user from an Open campaign based on their new availability.
        ex: If a user was signed up to play on a Monday campaign, and they are no longer
        free to play on mondays, this query will remove them from that campaign
    does not affect campaigns where the user is still available to play that day.
    """

    return f"   DELETE FROM \
                    campaign_player_roster \
                WHERE \
                    campaign_player_id in ( \
                        SELECT remove_from_campaign.campaign_player_id \
                        FROM ( \
                            SELECT * \
                            FROM campaign_player_roster \
                            LEFT JOIN user_availability using(user_id) \
                            JOIN campaigns using(campaign_id) \
                            WHERE user_id={user_id} \
                                AND ( \
                                    plays_on!=(SELECT IF(monday=1,1,0) FROM user_availability WHERE user_id={user_id}) \
                                    AND plays_on!=(SELECT IF(tuesday=1,2,0) FROM user_availability WHERE user_id={user_id}) \
                                    AND plays_on!=(SELECT IF(wednesday=1,3,0) FROM user_availability WHERE user_id={user_id}) \
                                    AND plays_on!=(SELECT IF(thursday=1,4,0) FROM user_availability WHERE user_id={user_id}) \
                                    AND plays_on!=(SELECT IF(friday=1,5,0) FROM user_availability WHERE user_id={user_id}) \
                                    AND plays_on!=(SELECT IF(saturday=1,6,0) FROM user_availability WHERE user_id={user_id}) \
                                    AND plays_on!=(SELECT IF(sunday=1,7,0) FROM user_availability WHERE user_id={user_id}) \
                                ) \
                                AND status='Open' \
                        ) as remove_from_campaign \
                    )"