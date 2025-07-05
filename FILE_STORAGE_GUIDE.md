# Donation App - File System Storage Implementation

A Next.js donation application with persistent file system storage for campaign management.

## 📁 **File System Storage Implementation**

### **Campaign Data Location:**
```
data/
└── campaigns.json    # Persistent campaign storage
```

### **Storage Architecture:**
```
Client (Browser) → API Endpoints → File System (campaigns.json)
```

## 🔧 **API Endpoints**

### **Campaign Management APIs:**

#### **GET /api/campaigns**
- **Purpose**: Retrieve all campaigns
- **Response**: `{ success: true, data: CampaignStorage }`
- **Auto-initialization**: Creates default campaign if none exist

#### **POST /api/campaigns**
- **Purpose**: Save all campaigns (bulk update)
- **Body**: `{ campaigns: CampaignStorage }`
- **Response**: `{ success: true, message: string, data: CampaignStorage }`

#### **PUT /api/campaigns**
- **Purpose**: Update or create a single campaign
- **Body**: `{ campaignId: string, campaign: CampaignConfig }`
- **Response**: `{ success: true, message: string, data: CampaignConfig }`

#### **DELETE /api/campaigns?id={campaignId}**
- **Purpose**: Delete a specific campaign
- **Query**: `id` - Campaign ID to delete
- **Response**: `{ success: true, message: string }`

#### **GET /api/campaigns/[id]**
- **Purpose**: Retrieve a single campaign by ID
- **Response**: `{ success: true, data: CampaignConfig }`
- **Error**: `{ success: false, message: "Campaign not found" }` (404)

## 💾 **Data Persistence Features**

### **Automatic Features:**
- **File Creation**: Automatically creates `data/` directory and `campaigns.json`
- **Default Campaign**: Auto-generates default campaign if file is empty
- **Error Handling**: Graceful fallbacks for file read/write errors
- **Backup Safety**: Atomic writes to prevent data corruption

### **Campaign Data Structure:**
```json
{
  "donate-iskcon-hubli-dharwad": {
    "id": "donate-iskcon-hubli-dharwad",
    "header": "Support Our Noble Cause",
    "bannerImageUrl": "https://...",
    "campaignImageUrl": "https://...",
    "details": "Campaign description...",
    "active": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

## 🔄 **Migration from localStorage**

### **Updated Components:**
- **AdminPage**: Now uses async API calls for all operations
- **CampaignsList**: Loads campaigns from file system via API
- **CampaignPage**: Fetches individual campaigns via API
- **Home Page**: Async campaign loading with better error handling

### **New Storage Functions:**
```typescript
// File: src/utils/fileStorage.ts
await loadCampaignsFromStorage()           // Load all campaigns
await saveCampaignsToStorage(campaigns)    // Save all campaigns
await getSingleCampaign(campaignId)        // Get one campaign
await saveSingleCampaign(id, campaign)     // Save one campaign
await deleteCampaignFromStorage(id)        // Delete campaign
```

## 🚀 **Deployment Considerations**

### **File System Requirements:**
- **Write Permissions**: Server needs write access to `data/` directory
- **Persistent Storage**: Data directory should be on persistent volume
- **Backup Strategy**: Regular backups of `campaigns.json` recommended

### **Production Setup:**
```bash
# Ensure data directory exists
mkdir -p data
chmod 755 data

# Set appropriate permissions
chown app:app data/
```

### **Environment Considerations:**
- **Development**: File stored locally in project directory
- **Production**: Consider using absolute path or mounted volume
- **Docker**: Mount `/app/data` as persistent volume
- **Serverless**: May need database instead of file storage

## 📊 **Benefits of File Storage**

### **Advantages:**
✅ **Persistent Data**: Survives server restarts  
✅ **No Database Setup**: Simple deployment  
✅ **Human Readable**: JSON format is easy to inspect/edit  
✅ **Version Control**: Can track campaigns in git (optional)  
✅ **Backup Friendly**: Simple file copying for backups  
✅ **Fast Access**: Direct file system reads  

### **Limitations:**
⚠️ **Concurrent Access**: Not ideal for high-traffic scenarios  
⚠️ **File Locking**: Multiple simultaneous writes could cause issues  
⚠️ **Scalability**: Single file approach doesn't scale horizontally  
⚠️ **Atomic Operations**: Basic file operations, no transactions  

## 🔧 **Configuration**

### **File Path Configuration:**
```typescript
// In API routes
const CAMPAIGNS_FILE_PATH = path.join(process.cwd(), 'data', 'campaigns.json');
```

### **Custom Data Directory:**
```typescript
// Environment variable support (optional)
const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), 'data');
```

## 🛠 **Development Workflow**

### **Local Development:**
1. **Start Development**: `npm run dev`
2. **Auto-Creation**: API automatically creates `data/campaigns.json`
3. **Live Updates**: Changes persist between server restarts
4. **Git Tracking**: Add `/data/campaigns.json` to `.gitignore` to avoid committing campaign data

### **Testing:**
```bash
# Test API endpoints
curl http://localhost:3000/api/campaigns
curl -X POST http://localhost:3000/api/campaigns -d '{"campaigns": {...}}'
```

## 📈 **Future Enhancements**

### **Possible Upgrades:**
- **Database Migration**: Easy migration path to PostgreSQL/MongoDB
- **File Locking**: Implement proper concurrent access control
- **Backup Automation**: Automated backup strategies
- **Data Validation**: JSON schema validation
- **Performance**: Caching layer for frequently accessed campaigns

### **Migration Path to Database:**
The current API structure makes it easy to migrate to a database later:
1. Replace file read/write operations with database queries
2. Keep the same API endpoints
3. No changes needed in frontend components

## 🔒 **Security Considerations**

### **File Access:**
- **Directory Permissions**: Restrict access to `data/` directory
- **Input Validation**: Validate all campaign data before saving
- **Path Traversal**: API prevents directory traversal attacks
- **JSON Parsing**: Safe JSON parsing with error handling

### **API Security:**
- **Input Sanitization**: All inputs are validated
- **Error Messages**: Don't expose internal file paths
- **Rate Limiting**: Consider adding rate limiting for production

## 📋 **Maintenance**

### **Regular Tasks:**
- **Backup**: Regular backups of `campaigns.json`
- **Monitoring**: Monitor file system space and permissions
- **Cleanup**: Remove unused campaign images if storing locally
- **Validation**: Periodic validation of JSON structure

This file system implementation provides a robust, simple solution for campaign storage while maintaining the flexibility to migrate to more sophisticated storage solutions as the application scales.
