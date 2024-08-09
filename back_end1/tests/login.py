from flask import Blueprint, request, jsonify
from flask import current_app as app
import requests
from flask_mysqldb import MySQL

# Create the Blueprint
bp = Blueprint('login', __name__)

# Initialize MySQL (assuming it's globally available)
mysql = MySQL()

@bp.route('/login', methods=['POST'])
def login():
    token = request.json.get('token')

    if not token:
        return jsonify({"message": "Token is required"}), 400

    # Verify token with Clerk and retrieve user information
    headers = {
        'Authorization': f'Bearer {app.config["CLERK_API_KEY"]}',
        'Content-Type': 'application/json'
    }
    response = requests.post('https://api.clerk.dev/v1/tokens/verify', headers=headers, json={'token': token})

    if response.status_code == 200:
        user_info = response.json()

        # Extract relevant user information
        clerk_id = user_info['sub']  # Clerk's unique identifier for the user
        email = user_info['email_addresses'][0]['email_address']
        username = user_info.get('username', None)

        # Check if the user already exists in the database
        cur = mysql.connection.cursor()
        cur.execute("SELECT * FROM customers WHERE user_id = %s", (clerk_id,))
        customer = cur.fetchone()
        
        if customer:
            # Optionally update user information
            cur.execute("""
                UPDATE customers
                SET user_name = %s, user_email = %s
                WHERE user_id = %s
            """, (username, email, clerk_id))
            mysql.connection.commit()
            cur.close()
            return jsonify({"message": "User already exists, information updated.", "user_id": clerk_id}), 200
        else:
            # Create a new customer entry
            cur.execute("""
                INSERT INTO customers (user_id, user_name, user_email)
                VALUES (%s, %s, %s)
            """, (clerk_id, username, email))
            mysql.connection.commit()
            cur.close()
            return jsonify({"message": "Login successful, new user created.", "user_id": clerk_id}), 200
    else:
        return jsonify({"message": "Invalid token"}), 401
