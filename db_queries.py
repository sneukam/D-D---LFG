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
                    the_count as 'signed_up', \
                    DATE_FORMAT(created, '%%b %%e %%Y') as created, \
                    IF(participation.signed_up_for = '1', 1, 0) as 'signed_up_for' \
                FROM \
                    campaigns \
                JOIN( \
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
                ORDER BY signed_up_for DESC, created DESC;"


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
                    the_count as 'signed_up', \
                    DATE_FORMAT(created, '%%b %%e %%Y') as created \
            FROM campaigns \
            JOIN ( \
                select count(campaign_id) as 'the_count', campaign_id \
                from campaign_player_roster \
                group by campaign_id \
            ) as campaign_count using (campaign_id) \
            WHERE status='Open' \
            ORDER BY created DESC;"