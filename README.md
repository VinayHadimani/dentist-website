# 🦷 Dr. Sarah Mitchell - Dentist Website

A professional, production-ready dentist business card website with appointment booking functionality.

## ✨ Features

### For Patients
- 📋 **Online Appointment Booking** - Easy-to-use booking form
- 🏥 **Services Showcase** - Display dental services with pricing
- 📞 **Contact Information** - Phone, email, and office hours
- 📱 **Responsive Design** - Works on all devices

### For the Doctor
- 🔐 **Secure Admin Panel** - Password-protected dashboard
- 📊 **Appointment Management** - View, update, and delete appointments
- 🔄 **Status Tracking** - Update appointment status (pending, confirmed, completed, cancelled)
- 💾 **Persistent Data** - SQLite database for reliable storage

---

## 🚀 Deployment Options

### Option 1: Docker (Recommended)

**Easiest way to deploy anywhere!**

```bash
# Build and run with Docker Compose
docker-compose up -d

# Or build manually
docker build -t dentist-website .
docker run -p 3000:3000 -e ADMIN_PASSWORD=your-password dentist-website
```

Access at: `http://localhost:3000`

### Option 2: Vercel (Free Hosting)

**Best for non-technical clients!**

1. Push code to GitHub
2. Connect repository to [Vercel](https://vercel.com)
3. Set environment variables:
   - `ADMIN_PASSWORD` = your secure password
4. Deploy!

### Option 3: Traditional Server

**For self-hosting on a VPS!**

```bash
# Install Bun (if not installed)
curl -fsSL https://bun.sh/install | bash

# Clone and setup
git clone <your-repo>
cd dentist-website
bun install

# Set up environment
cp .env.example .env
# Edit .env with your settings

# Build and run
bun run build
bun start
```

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file:

```env
# REQUIRED - Change this!
ADMIN_PASSWORD=your-secure-password-here

# Database (default is fine)
DATABASE_URL=file:./db/custom.db
```

### Customization

Edit `src/app/page.tsx` to customize:

| What to Change | Lines |
|----------------|-------|
| Doctor's Name | 574, 575, 641, 642 |
| Phone Number | 179-186, 579-585, 884-886 |
| Email | 183-186, 583-585 |
| Services | 51-87 |
| Office Hours | 869-875 |
| Address | 858-861 |
| Social Media Links | 924-932 |

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: SQLite + Prisma ORM
- **Icons**: Lucide React
- **Date Handling**: date-fns

---

## 📦 What's Included

```
├── src/
│   ├── app/
│   │   ├── page.tsx          # Main website
│   │   ├── layout.tsx        # Root layout
│   │   └── api/              # API routes
│   │       ├── appointments/ # Appointment CRUD
│   │       └── auth/         # Authentication
│   ├── components/ui/        # UI components
│   ├── hooks/                # Custom hooks
│   └── lib/                  # Utilities
├── prisma/
│   └── schema.prisma         # Database schema
├── Dockerfile                # Docker config
├── docker-compose.yml        # Docker Compose
└── .env.example              # Environment template
```

---

## 🔐 Security

- ✅ Password-protected admin panel
- ✅ HTTP-only session cookies
- ✅ Protected API routes
- ✅ Input validation
- ✅ Email format validation

---

## 🎯 Selling This Website

### Step-by-Step Delivery Process:

1. **Customize the Content**
   - Change doctor's name, phone, email
   - Update services and pricing
   - Add real address and office hours

2. **Set a Secure Password**
   ```bash
   # In .env file
   ADMIN_PASSWORD=something-secure-123
   ```

3. **Choose Deployment Method**

   **For Non-Technical Clients:**
   - Deploy to Vercel (free)
   - Set up custom domain
   - Give them the URL + admin password

   **For Technical Clients:**
   - Provide Docker container
   - Or give them the source code

4. **Handoff Checklist:**
   - [ ] Website URL
   - [ ] Admin password
   - [ ] Hosting account access (if applicable)
   - [ ] This README file
   - [ ] Support agreement (optional)

### Pricing Suggestions:

| Package | What's Included | Suggested Price |
|---------|-----------------|-----------------|
| **Basic** | Website + Deployment | $200-500 |
| **Standard** | + Custom domain setup | $500-800 |
| **Premium** | + Training + 30-day support | $800-1,500 |

---

## 📝 Quick Commands

```bash
# Development
bun run dev          # Start dev server
bun run lint         # Check code quality

# Database
bun run db:push      # Push schema changes
bun run db:generate  # Generate Prisma client

# Production
bun run build        # Build for production
bun start            # Start production server

# Docker
docker-compose up -d           # Start in background
docker-compose logs -f         # View logs
docker-compose down            # Stop containers
```

---

## 🆘 Support

If your client needs help:

1. **Admin Login Issues**: Check the `ADMIN_PASSWORD` in `.env`
2. **Database Issues**: Run `bun run db:push` to reset the database
3. **Build Errors**: Run `bun install` then `bun run build`

---

Built with ❤️ using Next.js and Tailwind CSS
