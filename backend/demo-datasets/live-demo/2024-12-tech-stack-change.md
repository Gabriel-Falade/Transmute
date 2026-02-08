# URGENT: Technology Stack Change
**Date:** 2024-12-10
**Author:** CTO

## Change of Direction - New Tech Stack

After consulting with our enterprise architect, we need to **switch the tech stack** for the customer portal.

## New Stack
- **Frontend:** Vue.js (NOT React - better for our use case)
- **Backend:** Python/Django (NOT Node - better security and stability)
- **Database:** PostgreSQL (NOT MongoDB - we need ACID compliance)
- **Hosting:** Google Cloud (NOT AWS - better pricing and support contract)

## Rationale
- Enterprise architect identified security concerns with original plan
- PostgreSQL required for audit compliance
- Python backend provides better long-term maintainability
- Google Cloud offers better pricing for our workload

## Timeline
- This decision is final
- Team training starts next week
- Still targeting March 2025 launch

I know this is different from last week's decision, but it's the right call for the business.
