import urllib.request
import os

mermaid_code = """flowchart LR
    subgraph Main [" "]
        style Main fill:#ffffff,stroke:#ffffff
        %% Start node
        Start([Start]) --> Browse["Browse Companions Directory"]
        Browse --> Filter{"Apply Filters?"}
        Filter -->|Yes| ApplyFilters["Filter by Game, Rank, Rating"] --> Browse
        Filter -->|No| PreChat["Initiate Pre-booking Chat"]
        
        PreChat --> SubmitBooking["Submit Booking Request (Duration, Time)"]
        SubmitBooking --> BuddyReview{"Buddy Reviews Request"}
        
        BuddyReview -->|Declined / Timeout| Cancel([Request Cancelled])
        BuddyReview -->|Accepted| PayBooking["Pay Booking Fee"]
        
        PayBooking --> LockEscrow["System Locks Fee in Escrow"]
        LockEscrow --> WaitTime["Wait for Scheduled Session Time"]
        WaitTime --> StartSession["Start Gaming Session (Play Together)"]
        StartSession --> EndSession["Session Completed (Duration Expired)"]
        
        EndSession --> ConfirmCompletion{"Both Confirm Completion?"}
        ConfirmCompletion -->|Yes| Payout["Release Escrow Funds (Less Platform Commission)"]
        ConfirmCompletion -->|Discrepancy / Dispute| AdminEscalation["Escalate to Platform Admin"]
        
        AdminEscalation --> AdminReview{"Admin Decision"}
        AdminReview -->|Buddy Fulfilled| Payout
        AdminReview -->|Buddy Flaked / Refund| Refund["Refund Funds to Gamer"]
        
        Payout --> Feedback["Gamer Submits Rating & Review"]
        Refund --> Finish([End])
        Feedback --> Finish
        Cancel --> Finish
    end"""

url = "https://kroki.io/mermaid/png"
output_file = "WOWNOW_Gaming_Buddy_Hiring_Activity_Diagram.png"

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
