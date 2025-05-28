SELECT json_object_agg(role, user_count) AS user_roles 
FROM (
    SELECT role, COUNT(*) AS user_count 
    FROM "Users" 
    GROUP BY role
) AS subquery;
