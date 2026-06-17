#!/bin/bash
set -e

API_URL="${API_URL:-http://localhost:4016/api}"
PASS=0
FAIL=0

assert_status() {
  local name="$1"
  local expected="$2"
  local actual="$3"
  if [ "$actual" -eq "$expected" ]; then
    echo "✅ $name (HTTP $actual)"
    PASS=$((PASS + 1))
  else
    echo "❌ $name (expected $expected, got $actual)"
    FAIL=$((FAIL + 1))
  fi
}

echo "=== EscapePulse Integration Tests ==="
echo "API: $API_URL"
echo ""

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/health")
assert_status "Health Check" 200 "$HTTP_CODE"

LOGIN_RESPONSE=$(curl -s -w "\n%{http_code}" "$API_URL/auth/login" \
  -H 'Content-Type: application/json' \
  -d '{"email":"demo@mysterymanorescapes.com","password":"demo123456"}')
HTTP_CODE=$(echo "$LOGIN_RESPONSE" | tail -1)
BODY=$(echo "$LOGIN_RESPONSE" | sed '$d')
assert_status "Login" 200 "$HTTP_CODE"

TOKEN=$(echo "$BODY" | python3 -c "import sys,json; print(json.load(sys.stdin)['accessToken'])" 2>/dev/null || echo "")

if [ -z "$TOKEN" ]; then
  echo "❌ Could not extract token"
  exit 1
fi

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/dashboard/stats" -H "Authorization: Bearer $TOKEN")
assert_status "Dashboard Stats" 200 "$HTTP_CODE"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/escape-rooms" -H "Authorization: Bearer $TOKEN")
assert_status "List Escape Rooms" 200 "$HTTP_CODE"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/game-sessions" -H "Authorization: Bearer $TOKEN")
assert_status "List Game Sessions" 200 "$HTTP_CODE"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/puzzle-maintenance" -H "Authorization: Bearer $TOKEN")
assert_status "List Puzzle Maintenance" 200 "$HTTP_CODE"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/reset-checklists" -H "Authorization: Bearer $TOKEN")
assert_status "List Reset Checklists" 200 "$HTTP_CODE"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/prop-orders" -H "Authorization: Bearer $TOKEN")
assert_status "List Prop Orders" 200 "$HTTP_CODE"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/rate-tiers" -H "Authorization: Bearer $TOKEN")
assert_status "List Rate Tiers" 200 "$HTTP_CODE"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/escape-venue" -H "Authorization: Bearer $TOKEN")
assert_status "Escape Venue Profile" 200 "$HTTP_CODE"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/puzzle-maintenance/urgent" -H "Authorization: Bearer $TOKEN")
assert_status "Urgent Puzzle Maintenance" 200 "$HTTP_CODE"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/prop-orders/pending" -H "Authorization: Bearer $TOKEN")
assert_status "Pending Prop Orders" 200 "$HTTP_CODE"

CREATE_ROOM=$(curl -s -w "\n%{http_code}" "$API_URL/escape-rooms" \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"name":"Test Room #99","wing":"Test Wing","theme":"mystery","notes":"Integration test room"}')
HTTP_CODE=$(echo "$CREATE_ROOM" | tail -1)
assert_status "Create Escape Room" 201 "$HTTP_CODE"

ROOM_ID=$(echo "$CREATE_ROOM" | sed '$d' | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])" 2>/dev/null || echo "")

if [ -n "$ROOM_ID" ]; then
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/escape-rooms/$ROOM_ID" \
    -H "Authorization: Bearer $TOKEN" \
    -H 'Content-Type: application/json' \
    -X PATCH \
    -d '{"status":"maintenance"}')
  assert_status "Update Escape Room" 200 "$HTTP_CODE"

  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/escape-rooms/$ROOM_ID" \
    -H "Authorization: Bearer $TOKEN" \
    -X DELETE)
  assert_status "Delete Escape Room" 200 "$HTTP_CODE"
fi

CREATE_PROP=$(curl -s -w "\n%{http_code}" "$API_URL/prop-orders" \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"customerName":"Test Supplier","propCategory":"RFID Lock","supplierName":"Escape Props Co.","price":99}')
HTTP_CODE=$(echo "$CREATE_PROP" | tail -1)
assert_status "Create Prop Order" 201 "$HTTP_CODE"

PROP_ID=$(echo "$CREATE_PROP" | sed '$d' | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])" 2>/dev/null || echo "")

if [ -n "$PROP_ID" ]; then
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/prop-orders/$PROP_ID" \
    -H "Authorization: Bearer $TOKEN" \
    -H 'Content-Type: application/json' \
    -X PATCH \
    -d '{"status":"in_progress"}')
  assert_status "Update Prop Order" 200 "$HTTP_CODE"

  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/prop-orders/$PROP_ID" \
    -H "Authorization: Bearer $TOKEN" \
    -X DELETE)
  assert_status "Delete Prop Order" 200 "$HTTP_CODE"
fi

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/dashboard/stats")
assert_status "Unauthorized Access" 401 "$HTTP_CODE"

echo ""
echo "=== Results: $PASS passed, $FAIL failed ==="
[ "$FAIL" -eq 0 ] && exit 0 || exit 1
