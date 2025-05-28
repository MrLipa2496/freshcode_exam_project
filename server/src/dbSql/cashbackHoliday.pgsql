WITH cashback AS (
  SELECT
    u.id AS user_id,
    SUM(c.prize * 0.1) AS cashback_amount
  FROM "Users" u
  JOIN "Contests" c ON u.id = c."userId"
  WHERE u.role = 'customer'
    AND c."createdAt" BETWEEN '2024-12-25' AND '2025-01-14'
  GROUP BY u.id
)
UPDATE "Users" u
SET balance = u.balance + cashback.cashback_amount
FROM cashback
WHERE u.id = cashback.user_id;

