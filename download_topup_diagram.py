import urllib.request
import os

mermaid_code = """sequenceDiagram
    autonumber
    actor Gamer as Gamer (App Client)
    participant Gateway as API Gateway
    participant Linker as Game Linker Service
    participant Pay as Payment Service
    participant MQ as Message Queue (Kafka)
    participant GameAPI as External Game Publisher API
    participant DeliverySvc as Delivery Broker Svc

    rect rgb(240, 248, 255)
        Gamer->>Gateway: Input playerId & zoneId
        Gateway->>Linker: Validate game account (playerId, zoneId)
        Linker->>GameAPI: Query player nickname (playerId, zoneId)
        GameAPI-->>Linker: Return player nickname (e.g., "ZilongMaster")
        Linker-->>Gateway: Verification Success ("ZilongMaster")
        Gateway-->>Gamer: Show Nickname for confirmation

        Gamer->>Gateway: Select 1000 Diamonds Package
        Gateway->>Pay: Create Payment Intention ($15)
        Pay-->>Gamer: Return ABA Pay Deep Link

        Gamer->>Pay: Approve payment on ABA Mobile App
        Pay-->>Gateway: Payment Status Hook (SUCCESS, Ref: ABA-9988)
        Gateway->>MQ: Publish "TopUpOrderApproved" event (playerId, zoneId, Package Info)
        Gateway-->>Gamer: Display "Payment Success, delivery in progress"

        critical Asynchronous Direct Game API Delivery
            MQ->>DeliverySvc: Consume "TopUpOrderApproved"
            DeliverySvc->>GameAPI: Direct API Call: Credit 1000 Diamonds to playerId & zoneId
            GameAPI-->>DeliverySvc: Confirm Credit Success
            DeliverySvc->>Gateway: Notify Order Complete
            Gateway->>Gamer: Send Push Notification: "Diamonds Credited Successfully!"
        end
    end"""

url = "https://kroki.io/mermaid/png"
output_file = "WOWNOW_Game_TopUp_System_Sequence_Diagram.png"

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
