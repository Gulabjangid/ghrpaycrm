import type { Agent } from '@/types/agent';
import type { Lead } from '@/types/lead';
import type { Visit } from '@/types/visit';
import type { Activity, FollowUp, Property } from '@/types/activity';

const now = new Date();
const d = (offset: number) => new Date(now.getTime() + offset * 3600000).toISOString();

export const SEED_AGENTS: Agent[] = [
  { id: 'a1', user_id: 'u1', name: 'Priya Sharma', email: 'priya@gravityflow.in', phone: '9876543210', role: 'admin', is_active: true, created_at: d(-720), updated_at: d(-24) },
  { id: 'a2', user_id: 'u2', name: 'Rahul Mehta', email: 'rahul@gravityflow.in', phone: '9876543211', role: 'agent', is_active: true, created_at: d(-600), updated_at: d(-12) },
  { id: 'a3', user_id: 'u3', name: 'Ananya Das', email: 'ananya@gravityflow.in', phone: '9876543212', role: 'agent', is_active: true, created_at: d(-500), updated_at: d(-6) },
  { id: 'a4', user_id: 'u4', name: 'Vikram Singh', email: 'vikram@gravityflow.in', phone: '9876543213', role: 'agent', is_active: true, created_at: d(-400), updated_at: d(-2) },
];

export const SEED_PROPERTIES: Property[] = [
  { id: 'p1', name: 'Gravity Heights', address: '42 MG Road', city: 'Bengaluru', locality: 'Indiranagar', total_units: 48, vacant_units: 8, rent_min: 15000, rent_max: 28000, property_type: 'coliving', images: [], amenities: ['WiFi', 'Gym', 'Laundry', 'Parking'], is_active: true, created_at: d(-720) },
  { id: 'p2', name: 'Skyline Residency', address: '88 Sarjapur Rd', city: 'Bengaluru', locality: 'HSR Layout', total_units: 36, vacant_units: 12, rent_min: 12000, rent_max: 22000, property_type: 'coliving', images: [], amenities: ['WiFi', 'Cafeteria', 'Rooftop'], is_active: true, created_at: d(-600) },
  { id: 'p3', name: 'Bloom Apartments', address: '15 Whitefield Main', city: 'Bengaluru', locality: 'Whitefield', total_units: 24, vacant_units: 3, rent_min: 25000, rent_max: 45000, property_type: 'apartment', images: [], amenities: ['Pool', 'Gym', 'Clubhouse'], is_active: true, created_at: d(-500) },
  { id: 'p4', name: 'Nest Co-Living', address: '7 Koramangala 5th Block', city: 'Bengaluru', locality: 'Koramangala', total_units: 60, vacant_units: 18, rent_min: 10000, rent_max: 20000, property_type: 'coliving', images: [], amenities: ['WiFi', 'Meals', 'Housekeeping'], is_active: true, created_at: d(-400) },
  { id: 'p5', name: 'Cedar Villas', address: '23 Bannerghatta Rd', city: 'Bengaluru', locality: 'JP Nagar', total_units: 12, vacant_units: 2, rent_min: 55000, rent_max: 85000, property_type: 'villa', images: [], amenities: ['Garden', 'Parking', 'Security'], is_active: true, created_at: d(-350) },
  { id: 'p6', name: 'Metro Living Hub', address: '55 Electronic City', city: 'Bengaluru', locality: 'Electronic City', total_units: 80, vacant_units: 25, rent_min: 8000, rent_max: 16000, property_type: 'coliving', images: [], amenities: ['WiFi', 'Gym', 'Game Room'], is_active: true, created_at: d(-300) },
];

export const SEED_LEADS: Lead[] = [
  { id: 'l1', name: 'Arjun Nair', phone: '9988776601', email: 'arjun@gmail.com', source: 'web', stage: 'new', temperature: 'hot', score: 82, assigned_to: 'a2', property_id: 'p1', budget_min: 15000, budget_max: 25000, occupants: 1, tags: ['professional'], created_at: d(-2), updated_at: d(-1), notes: 'Relocating from Chennai for new job' },
  { id: 'l2', name: 'Meera Patel', phone: '9988776602', email: 'meera.p@outlook.com', source: 'referral', stage: 'contacted', temperature: 'warm', score: 65, assigned_to: 'a3', property_id: 'p2', budget_min: 12000, budget_max: 18000, occupants: 1, tags: ['student'], last_contacted: d(-12), created_at: d(-48), updated_at: d(-12) },
  { id: 'l3', name: 'Karthik Reddy', phone: '9988776603', source: 'portal', stage: 'tour_scheduled', temperature: 'hot', score: 88, assigned_to: 'a2', property_id: 'p1', budget_min: 20000, budget_max: 30000, occupants: 2, tags: ['professional', 'NRI'], next_follow_up: d(4), created_at: d(-96), updated_at: d(-6) },
  { id: 'l4', name: 'Sneha Kulkarni', phone: '9988776604', email: 'sneha.k@gmail.com', source: 'walk_in', stage: 'tour_done', temperature: 'hot', score: 91, assigned_to: 'a4', property_id: 'p3', budget_min: 30000, budget_max: 50000, occupants: 1, tags: ['professional'], last_contacted: d(-6), created_at: d(-168), updated_at: d(-6) },
  { id: 'l5', name: 'Deepak Joshi', phone: '9988776605', source: 'social', stage: 'negotiation', temperature: 'hot', score: 93, assigned_to: 'a2', property_id: 'p5', budget_min: 55000, budget_max: 80000, occupants: 3, tags: ['family'], last_contacted: d(-3), next_follow_up: d(2), created_at: d(-240), updated_at: d(-3) },
  { id: 'l6', name: 'Fatima Sheikh', phone: '9988776606', email: 'fatima@yahoo.com', source: 'broker', stage: 'booked', temperature: 'hot', score: 98, assigned_to: 'a3', property_id: 'p1', budget_min: 18000, budget_max: 22000, occupants: 1, tags: ['professional'], last_contacted: d(-24), created_at: d(-360), updated_at: d(-24) },
  { id: 'l7', name: 'Rohan Gupta', phone: '9988776607', source: 'cold_call', stage: 'lost', temperature: 'cold', score: 15, assigned_to: 'a4', property_id: 'p4', budget_min: 8000, budget_max: 12000, occupants: 1, tags: ['student'], lost_reason: 'Too expensive', created_at: d(-480), updated_at: d(-120) },
  { id: 'l8', name: 'Aisha Khan', phone: '9988776608', email: 'aisha@gmail.com', source: 'web', stage: 'new', temperature: 'warm', score: 55, assigned_to: 'a3', property_id: 'p6', budget_min: 10000, budget_max: 15000, occupants: 1, tags: ['student'], created_at: d(-5), updated_at: d(-5) },
  { id: 'l9', name: 'Sanjay Verma', phone: '9988776609', source: 'referral', stage: 'contacted', temperature: 'warm', score: 60, assigned_to: 'a2', property_id: 'p4', budget_min: 10000, budget_max: 18000, occupants: 1, tags: ['professional'], last_contacted: d(-24), created_at: d(-72), updated_at: d(-24) },
  { id: 'l10', name: 'Lakshmi Iyer', phone: '9988776610', email: 'lakshmi@gmail.com', source: 'portal', stage: 'tour_scheduled', temperature: 'warm', score: 70, assigned_to: 'a4', property_id: 'p2', budget_min: 14000, budget_max: 20000, occupants: 1, tags: ['professional'], next_follow_up: d(8), created_at: d(-120), updated_at: d(-12) },
  { id: 'l11', name: 'Amit Saxena', phone: '9988776611', source: 'walk_in', stage: 'new', temperature: 'cold', score: 30, assigned_to: 'a2', property_id: 'p6', budget_min: 8000, budget_max: 12000, occupants: 1, tags: [], created_at: d(-8), updated_at: d(-8) },
  { id: 'l12', name: 'Divya Menon', phone: '9988776612', email: 'divya.m@gmail.com', source: 'social', stage: 'contacted', temperature: 'hot', score: 78, assigned_to: 'a3', property_id: 'p3', budget_min: 28000, budget_max: 40000, occupants: 2, tags: ['family'], last_contacted: d(-6), created_at: d(-60), updated_at: d(-6) },
  { id: 'l13', name: 'Nikhil Chopra', phone: '9988776613', source: 'broker', stage: 'tour_done', temperature: 'warm', score: 72, assigned_to: 'a4', property_id: 'p1', budget_min: 18000, budget_max: 25000, occupants: 1, tags: ['professional'], last_contacted: d(-48), created_at: d(-200), updated_at: d(-48) },
  { id: 'l14', name: 'Pooja Bhat', phone: '9988776614', email: 'pooja.b@outlook.com', source: 'web', stage: 'negotiation', temperature: 'warm', score: 75, assigned_to: 'a3', property_id: 'p4', budget_min: 12000, budget_max: 16000, occupants: 1, tags: ['student'], last_contacted: d(-12), next_follow_up: d(-4), created_at: d(-280), updated_at: d(-12) },
  { id: 'l15', name: 'Rajesh Kumar', phone: '9988776615', source: 'cold_call', stage: 'booked', temperature: 'hot', score: 95, assigned_to: 'a2', property_id: 'p2', budget_min: 15000, budget_max: 20000, occupants: 1, tags: ['professional'], last_contacted: d(-48), created_at: d(-400), updated_at: d(-48) },
  { id: 'l16', name: 'Tanya Oberoi', phone: '9988776616', source: 'referral', stage: 'lost', temperature: 'cold', score: 20, assigned_to: 'a4', property_id: 'p5', budget_min: 40000, budget_max: 60000, occupants: 2, tags: ['family'], lost_reason: 'Chose competitor', created_at: d(-500), updated_at: d(-200) },
  { id: 'l17', name: 'Suresh Babu', phone: '9988776617', email: 'suresh@gmail.com', source: 'portal', stage: 'new', temperature: 'warm', score: 50, assigned_to: 'a3', property_id: 'p6', budget_min: 9000, budget_max: 14000, occupants: 1, tags: ['student'], created_at: d(-10), updated_at: d(-10) },
  { id: 'l18', name: 'Kavitha Rao', phone: '9988776618', source: 'web', stage: 'contacted', temperature: 'warm', score: 58, assigned_to: 'a2', property_id: 'p1', budget_min: 16000, budget_max: 24000, occupants: 1, tags: ['professional'], last_contacted: d(-36), created_at: d(-80), updated_at: d(-36) },
  { id: 'l19', name: 'Manish Tiwari', phone: '9988776619', source: 'social', stage: 'tour_scheduled', temperature: 'hot', score: 85, assigned_to: 'a4', property_id: 'p3', budget_min: 30000, budget_max: 45000, occupants: 1, tags: ['NRI'], next_follow_up: d(6), created_at: d(-150), updated_at: d(-8) },
  { id: 'l20', name: 'Neha Agarwal', phone: '9988776620', email: 'neha.a@gmail.com', source: 'walk_in', stage: 'tour_done', temperature: 'warm', score: 68, assigned_to: 'a3', property_id: 'p2', budget_min: 13000, budget_max: 19000, occupants: 1, tags: ['student'], last_contacted: d(-24), created_at: d(-180), updated_at: d(-24) },
  { id: 'l21', name: 'Prasad Hegde', phone: '9988776621', source: 'broker', stage: 'negotiation', temperature: 'hot', score: 87, assigned_to: 'a2', property_id: 'p1', budget_min: 20000, budget_max: 28000, occupants: 2, tags: ['professional'], last_contacted: d(-6), next_follow_up: d(1), created_at: d(-260), updated_at: d(-6) },
  { id: 'l22', name: 'Ritu Malhotra', phone: '9988776622', email: 'ritu@gmail.com', source: 'referral', stage: 'booked', temperature: 'hot', score: 96, assigned_to: 'a4', property_id: 'p4', budget_min: 12000, budget_max: 16000, occupants: 1, tags: ['professional'], last_contacted: d(-72), created_at: d(-380), updated_at: d(-72) },
  { id: 'l23', name: 'Gaurav Sinha', phone: '9988776623', source: 'portal', stage: 'lost', temperature: 'cold', score: 12, assigned_to: 'a3', property_id: 'p6', budget_min: 8000, budget_max: 11000, occupants: 1, tags: ['student'], lost_reason: 'No response', created_at: d(-450), updated_at: d(-300) },
  { id: 'l24', name: 'Swati Deshmukh', phone: '9988776624', email: 'swati@outlook.com', source: 'web', stage: 'new', temperature: 'hot', score: 76, assigned_to: 'a4', property_id: 'p3', budget_min: 28000, budget_max: 42000, occupants: 1, tags: ['professional', 'NRI'], created_at: d(-3), updated_at: d(-3) },
  { id: 'l25', name: 'Varun Kapoor', phone: '9988776625', source: 'social', stage: 'contacted', temperature: 'cold', score: 35, assigned_to: 'a2', property_id: 'p4', budget_min: 10000, budget_max: 14000, occupants: 1, tags: [], last_contacted: d(-96), created_at: d(-100), updated_at: d(-96) },
];

export const SEED_VISITS: Visit[] = [
  { id: 'v1', lead_id: 'l3', property_id: 'p1', agent_id: 'a2', scheduled_at: d(2), duration_min: 30, status: 'scheduled', created_at: d(-24), post_tour_form_filled: false },
  { id: 'v2', lead_id: 'l10', property_id: 'p2', agent_id: 'a4', scheduled_at: d(5), duration_min: 45, status: 'scheduled', created_at: d(-12), post_tour_form_filled: false },
  { id: 'v3', lead_id: 'l19', property_id: 'p3', agent_id: 'a4', scheduled_at: d(3), duration_min: 30, status: 'scheduled', created_at: d(-8), post_tour_form_filled: false },
  { id: 'v4', lead_id: 'l4', property_id: 'p3', agent_id: 'a4', scheduled_at: d(-48), duration_min: 45, status: 'completed', feedback: 'Loved the amenities, discussing with family', created_at: d(-72), post_tour_form_filled: true },
  { id: 'v5', lead_id: 'l13', property_id: 'p1', agent_id: 'a4', scheduled_at: d(-72), duration_min: 30, status: 'completed', feedback: 'Good but wants lower floor', created_at: d(-96), post_tour_form_filled: true },
  { id: 'v6', lead_id: 'l6', property_id: 'p1', agent_id: 'a3', scheduled_at: d(-168), duration_min: 60, status: 'completed', feedback: 'Perfect match, ready to book', created_at: d(-192), post_tour_form_filled: true },
  { id: 'v7', lead_id: 'l20', property_id: 'p2', agent_id: 'a3', scheduled_at: d(-24), duration_min: 30, status: 'completed', feedback: 'Needs to compare with other options', created_at: d(-48), post_tour_form_filled: false },
  { id: 'v8', lead_id: 'l7', property_id: 'p4', agent_id: 'a4', scheduled_at: d(-200), duration_min: 30, status: 'no_show', created_at: d(-220), post_tour_form_filled: false },
];

export const SEED_FOLLOW_UPS: FollowUp[] = [
  { id: 'f1', lead_id: 'l1', agent_id: 'a2', due_at: d(-8), type: 'call', note: 'Initial follow-up call', is_done: false, created_at: d(-24), snooze_count: 1 },
  { id: 'f2', lead_id: 'l2', agent_id: 'a3', due_at: d(-4), type: 'whatsapp', note: 'Send property brochure', is_done: false, created_at: d(-48), snooze_count: 0 },
  { id: 'f3', lead_id: 'l5', agent_id: 'a2', due_at: d(2), type: 'call', note: 'Discuss pricing terms', is_done: false, created_at: d(-12) },
  { id: 'f4', lead_id: 'l8', agent_id: 'a3', due_at: d(0.5), type: 'call', note: 'First contact attempt', is_done: false, created_at: d(-5) },
  { id: 'f5', lead_id: 'l9', agent_id: 'a2', due_at: d(-2), type: 'email', note: 'Send comparison sheet', is_done: false, created_at: d(-36), snooze_count: 2 },
  { id: 'f6', lead_id: 'l12', agent_id: 'a3', due_at: d(4), type: 'visit', note: 'Schedule property tour', is_done: false, created_at: d(-6) },
  { id: 'f7', lead_id: 'l14', agent_id: 'a3', due_at: d(-10), type: 'call', note: 'Follow up on pricing counter', is_done: false, created_at: d(-24), snooze_count: 1 },
  { id: 'f8', lead_id: 'l21', agent_id: 'a2', due_at: d(1), type: 'call', note: 'Close the deal', is_done: false, created_at: d(-6) },
  { id: 'f9', lead_id: 'l4', agent_id: 'a4', due_at: d(6), type: 'whatsapp', note: 'Check if ready to book', is_done: false, created_at: d(-6) },
  { id: 'f10', lead_id: 'l6', agent_id: 'a3', due_at: d(-48), type: 'call', note: 'Booking confirmation call', is_done: true, done_at: d(-46), created_at: d(-72) },
  { id: 'f11', lead_id: 'l15', agent_id: 'a2', due_at: d(-96), type: 'email', note: 'Send agreement', is_done: true, done_at: d(-94), created_at: d(-120) },
  { id: 'f12', lead_id: 'l24', agent_id: 'a4', due_at: d(0.25), type: 'call', note: 'Hot NRI lead - call ASAP', is_done: false, created_at: d(-3) },
  { id: 'f13', lead_id: 'l11', agent_id: 'a2', due_at: d(-1), type: 'call', note: 'First contact', is_done: false, created_at: d(-8) },
  { id: 'f14', lead_id: 'l18', agent_id: 'a2', due_at: d(-18), type: 'whatsapp', note: 'Share virtual tour', is_done: false, created_at: d(-36), snooze_count: 3 },
  { id: 'f15', lead_id: 'l25', agent_id: 'a2', due_at: d(-48), type: 'call', note: 'Re-engage cold lead', is_done: false, created_at: d(-96), snooze_count: 2 },
];

export const SEED_ACTIVITIES: Activity[] = [
  { id: 'act1', lead_id: 'l1', agent_id: 'a2', type: 'assignment', content: 'Lead assigned to Rahul Mehta', created_at: d(-2) },
  { id: 'act2', lead_id: 'l3', agent_id: 'a2', type: 'call', content: 'Discussed requirements, very interested in Gravity Heights', created_at: d(-72) },
  { id: 'act3', lead_id: 'l3', agent_id: 'a2', type: 'stage_change', content: 'Moved from Contacted → Tour Scheduled', created_at: d(-48) },
  { id: 'act4', lead_id: 'l4', agent_id: 'a4', type: 'visit', content: 'Tour completed at Bloom Apartments', created_at: d(-48) },
  { id: 'act5', lead_id: 'l4', agent_id: 'a4', type: 'note', content: 'Client loves the pool area, budget flexible up to 45K', created_at: d(-46) },
  { id: 'act6', lead_id: 'l5', agent_id: 'a2', type: 'stage_change', content: 'Moved from Tour Done → Negotiation', created_at: d(-48) },
  { id: 'act7', lead_id: 'l5', agent_id: 'a2', type: 'call', content: 'Discussed pricing — wants 10% discount on quoted rent', created_at: d(-24) },
  { id: 'act8', lead_id: 'l6', agent_id: 'a3', type: 'stage_change', content: 'Moved from Negotiation → Booked', created_at: d(-24) },
  { id: 'act9', lead_id: 'l6', agent_id: 'a3', type: 'note', content: 'Booking confirmed! Move-in on 15th', created_at: d(-24) },
  { id: 'act10', lead_id: 'l7', agent_id: 'a4', type: 'stage_change', content: 'Moved to Lost — Too expensive', created_at: d(-120) },
  { id: 'act11', lead_id: 'l8', agent_id: 'a3', type: 'assignment', content: 'Lead assigned to Ananya Das', created_at: d(-5) },
  { id: 'act12', lead_id: 'l12', agent_id: 'a3', type: 'whatsapp', content: 'Sent property images and amenities list', created_at: d(-12) },
  { id: 'act13', lead_id: 'l14', agent_id: 'a3', type: 'call', content: 'Discussed pricing, will counter offer tomorrow', created_at: d(-12) },
  { id: 'act14', lead_id: 'l15', agent_id: 'a2', type: 'stage_change', content: 'Moved from Negotiation → Booked', created_at: d(-48) },
  { id: 'act15', lead_id: 'l19', agent_id: 'a4', type: 'stage_change', content: 'Moved from Contacted → Tour Scheduled', created_at: d(-8) },
  { id: 'act16', lead_id: 'l20', agent_id: 'a3', type: 'visit', content: 'Tour completed at Skyline Residency', created_at: d(-24) },
  { id: 'act17', lead_id: 'l21', agent_id: 'a2', type: 'call', content: 'Discussed final terms, positive outlook', created_at: d(-6) },
  { id: 'act18', lead_id: 'l24', agent_id: 'a4', type: 'assignment', content: 'Lead assigned to Vikram Singh', created_at: d(-3) },
  { id: 'act19', lead_id: 'l2', agent_id: 'a3', type: 'call', content: 'First contact — interested but needs time', created_at: d(-36) },
  { id: 'act20', lead_id: 'l9', agent_id: 'a2', type: 'email', content: 'Sent property comparison document', created_at: d(-24) },
];
