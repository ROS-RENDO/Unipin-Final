import urllib.request
import os

mermaid_code = """%%{init: {'themeCSS': 'svg { background-color: white; }'}}%%
sequenceDiagram
    autonumber
    actor NormalUser as Normal User / Gamer
    actor Admin as WOWNOW Admin Team
    actor Buddy as Approved Gaming Buddy
    participant App as WOWNOW Mobile App
    participant Gateway as API Gateway
    participant BuddySvc as Companion Registry Service
    participant BookingSvc as Booking & Escrow Service
    participant PaySvc as Payment Service

    %% OPTION 1: BECOMING A GAMING BUDDY
    rect rgb(240, 248, 255)
        note right of NormalUser: Option 1: Apply to Become a Gaming Buddy
        NormalUser->>App: Click "Become a Gaming Buddy"
        App->>NormalUser: Display application form (Upload rank screenshots, voice clip, set hourly rate)
        NormalUser->>App: Submit Application Data
        App->>Gateway: POST /buddies/apply (Upload documents)
        Gateway->>BuddySvc: Save Application (Status: PENDING_REVIEW)
        BuddySvc-->>App: Acknowledge submission (Display: "Application under review")
        
        %% Admin Review Process
        Admin->>App: Access Admin Panel (Get pending applications)
        App->>Gateway: GET /admin/buddies/pending
        Gateway->>BuddySvc: Fetch list of pending buddy applications
        BuddySvc-->>Admin: Return list of portfolios & documents
        Admin->>Admin: Verify rank screenshot & listen to voice clip
        
        alt Application Approved
            Admin->>App: Click "Approve Profile"
            App->>Gateway: POST /admin/buddies/approve (userId)
            Gateway->>BuddySvc: Update status to APPROVED & role to GAMING_BUDDY
            BuddySvc-->>Admin: Success
            BuddySvc->>App: Dispatch Push Notification ("Congratulations! You are now a Gaming Buddy")
        else Application Rejected
            Admin->>App: Click "Reject Profile" (Specify reason)
            App->>Gateway: POST /admin/buddies/reject (userId, reason)
            Gateway->>BuddySvc: Update status to REJECTED
            BuddySvc-->>Admin: Success
            BuddySvc->>App: Dispatch Push Notification ("Application Rejected")
        end
    end

    %% OPTION 2: HIRING A GAMING BUDDY
    rect rgb(20, 20, 20)
        note right of NormalUser: Option 2: Hire a Gaming Buddy to Carry/Play
        NormalUser->>App: Search & filter Gaming Buddies directory
        App->>Gateway: GET /buddies?game=MLBB&rank=Mythic
        Gateway->>BuddySvc: Query active & online companions
        BuddySvc-->>NormalUser: Return matching buddy list
        
        NormalUser->>App: Select Buddy & send Booking Request (Duration: 2 hours)
        App->>Gateway: POST /bookings (buddyId, hours)
        Gateway->>BookingSvc: Create Booking (Status: PENDING_ACCEPTANCE)
        BookingSvc->>App: Notify Buddy of incoming hire request
        Buddy->>App: Click "Accept Booking"
        App->>Gateway: POST /bookings/{id}/accept
        Gateway->>BookingSvc: Update booking status to PENDING_PAYMENT
        
        NormalUser->>App: Proceed to checkout
        App->>Gateway: POST /payments/checkout (bookingId)
        Gateway->>PaySvc: Secure booking fee in ESCROW wallet
        PaySvc-->>NormalUser: Payment Success (Status: PAID_ESCROW)
        
        note over NormalUser, Buddy: Play Session: Buddy carries Gamer to higher rank
        
        NormalUser->>App: Confirm session completed successfully
        App->>Gateway: POST /bookings/{id}/complete
        Gateway->>BookingSvc: Update status to COMPLETED
        BookingSvc->>PaySvc: Trigger Escrow Release (Deduct 15% platform commission)
        PaySvc->>BuddySvc: Credit remaining 85% to Buddy's earnings balance
        PaySvc-->>Buddy: Send notification: "Payout credited to your balance"
    end"""

url = "https://kroki.io/mermaid/png"
output_file = "WOWNOW_Gaming_Buddy_Lifecycle_Sequence_Diagram.png"

print(f"Sending POST request to Kroki API: {url}")

req = urllib.request.Request(
    url, 
    data=mermaid_code.encode("utf-8"),
    headers={
        'Content-Type': 'text/plain',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
    },
    method='POST'
)

try:
    with urllib.request.urlopen(req) as response:
        with open(output_file, 'wb') as out_file:
            out_file.write(response.read())
    print(f"Success! Diagram PNG successfully compiled and saved to: {os.path.abspath(output_file)}")
except Exception as e:
    print(f"Error compiling/downloading image via Kroki API: {e}")
