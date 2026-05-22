<?php
namespace Database\Seeders;
use App\Models\Dispatch;
use App\Models\Notification;
use App\Models\Rating;
use App\Models\ServiceRequest;
use App\Models\Skill;
use App\Models\Technician;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $skillsData = [
            ['name' => 'Circuit Breaker Repair',    'category' => 'electrical'],
            ['name' => 'Wiring & Cabling',          'category' => 'electrical'],
            ['name' => 'HVAC Maintenance',           'category' => 'hvac'],
            ['name' => 'AC Installation',            'category' => 'hvac'],
            ['name' => 'PLC Programming',            'category' => 'plc'],
            ['name' => 'SCADA Systems',              'category' => 'plc'],
            ['name' => 'Transformer Testing',        'category' => 'transformer'],
            ['name' => 'Oil Analysis',               'category' => 'transformer'],
            ['name' => 'Electrical Inspection',      'category' => 'inspection'],
            ['name' => 'Safety Audit',               'category' => 'inspection'],
            ['name' => 'Network Setup',              'category' => 'networking'],
            ['name' => 'Industrial IoT',             'category' => 'networking'],
        ];
        $skills = [];
        foreach ($skillsData as $s) {
            $skills[] = Skill::create($s);
        }
        User::create([
            'name'     => 'Admin User',
            'email'    => 'admin@schneider.com',
            'password' => Hash::make('password'),
            'role'     => 'admin',
            'phone'    => '+91-9000000001',
        ]);
        $dispatcher = User::create([
            'name'     => 'Sarah Dispatcher',
            'email'    => 'dispatcher@schneider.com',
            'password' => Hash::make('password'),
            'role'     => 'dispatcher',
            'phone'    => '+91-9000000002',
        ]);
        $techUsers = [
            ['name' => 'Rahul Sharma',   'email' => 'rahul@schneider.com',   'lat' => 28.6292, 'lng' => 77.2190],
            ['name' => 'Amit Patel',     'email' => 'amit@schneider.com',    'lat' => 28.6100, 'lng' => 77.2300],
            ['name' => 'Priya Singh',    'email' => 'priya@schneider.com',   'lat' => 28.6350, 'lng' => 77.2050],
            ['name' => 'Arjun Verma',    'email' => 'arjun@schneider.com',   'lat' => 28.6400, 'lng' => 77.2200],
            ['name' => 'Kavita Das',     'email' => 'kavita@schneider.com',  'lat' => 28.6150, 'lng' => 77.2500],
        ];
        $technicians = [];
        foreach ($techUsers as $i => $tu) {
            $user = User::create([
                'name'     => $tu['name'],
                'email'    => $tu['email'],
                'password' => Hash::make('password'),
                'role'     => 'technician',
                'phone'    => '+91-900000000' . ($i + 3),
            ]);
            $tech = Technician::create([
                'user_id'             => $user->id,
                'employee_code'       => 'SE-' . str_pad($i + 1, 4, '0', STR_PAD_LEFT),
                'availability_status' => 'available',
                'current_lat'         => $tu['lat'],
                'current_lng'         => $tu['lng'],
                'last_location_at'    => now(),
                'rating_avg'          => round(3.5 + ($i * 0.5), 1),
                'total_jobs'          => 10 + ($i * 5),
            ]);
            $skillSubset = array_slice($skills, $i * 2, 3);
            foreach ($skillSubset as $skill) {
                $tech->skills()->attach($skill->id, [
                    'proficiency'      => ['beginner', 'intermediate', 'expert'][$i % 3],
                    'experience_years' => $i + 2,
                ]);
            }
            $technicians[] = $tech;
        }
        $client1 = User::create([
            'name'     => 'Khushi',
            'email'    => 'client1@example.com',
            'password' => Hash::make('password'),
            'role'     => 'client',
            'phone'    => '+91-9000000010',
        ]);
        $client2 = User::create([
            'name'     => 'Neha Client',
            'email'    => 'client2@example.com',
            'password' => Hash::make('password'),
            'role'     => 'client',
            'phone'    => '+91-9000000011',
        ]);
        $requests = [
            [
                'client_id'        => $client1->id,
                'title'            => 'Main breaker keeps tripping',
                'description'      => 'The main circuit breaker in Building A trips every few hours. Need urgent inspection.',
                'category'         => 'electrical',
                'priority'         => 'urgent',
                'status'           => 'completed',
                'location_lat'     => 28.6139,
                'location_lng'     => 77.2090,
                'location_address' => 'Building A, Connaught Place, New Delhi',
                'requested_at'     => Carbon::now()->subDays(5),
                'resolved_at'      => Carbon::now()->subDays(4),
            ],
            [
                'client_id'        => $client1->id,
                'title'            => 'HVAC not cooling in server room',
                'description'      => 'Server room temperature rising above 30°C. AC unit needs immediate repair.',
                'category'         => 'hvac',
                'priority'         => 'high',
                'status'           => 'pending',
                'location_lat'     => 28.6200,
                'location_lng'     => 77.2150,
                'location_address' => 'Tech Park, Block C, New Delhi',
                'requested_at'     => Carbon::now()->subHours(2),
            ],
            [
                'client_id'        => $client2->id,
                'title'            => 'PLC fault on assembly line',
                'description'      => 'PLC controller showing fault codes. Production halted on Line 3.',
                'category'         => 'plc',
                'priority'         => 'urgent',
                'status'           => 'pending',
                'location_lat'     => 28.6300,
                'location_lng'     => 77.2200,
                'location_address' => 'Manufacturing Unit, Okhla Phase 2, New Delhi',
                'requested_at'     => Carbon::now()->subHours(1),
            ],
            [
                'client_id'        => $client2->id,
                'title'            => 'Annual transformer inspection due',
                'description'      => 'Scheduled annual inspection of 500kVA transformer.',
                'category'         => 'inspection',
                'priority'         => 'low',
                'status'           => 'assigned',
                'location_lat'     => 28.6250,
                'location_lng'     => 77.2100,
                'location_address' => 'Substation 7, Nehru Place, New Delhi',
                'requested_at'     => Carbon::now()->subDays(1),
            ],
            [
                'client_id'        => $client1->id,
                'title'            => 'Router configuration failing',
                'description'      => 'Main network router is dropping packets and needs immediate reconfiguration.',
                'category'         => 'networking',
                'priority'         => 'high',
                'status'           => 'pending',
                'location_lat'     => 28.6180,
                'location_lng'     => 77.2120,
                'location_address' => 'IT Park, Tower B, New Delhi',
                'requested_at'     => Carbon::now()->subMinutes(30),
            ],
            [
                'client_id'        => $client2->id,
                'title'            => 'SCADA display frozen',
                'description'      => 'The SCADA monitoring display in the control room is frozen and unresponsive.',
                'category'         => 'plc',
                'priority'         => 'urgent',
                'status'           => 'pending',
                'location_lat'     => 28.6320,
                'location_lng'     => 77.2180,
                'location_address' => 'Control Room, Okhla Phase 2, New Delhi',
                'requested_at'     => Carbon::now()->subMinutes(15),
            ],
            [
                'client_id'        => $client1->id,
                'title'            => 'Routine safety audit',
                'description'      => 'Bi-annual safety audit for the entire electrical grid.',
                'category'         => 'inspection',
                'priority'         => 'low',
                'status'           => 'pending',
                'location_lat'     => 28.6220,
                'location_lng'     => 77.2250,
                'location_address' => 'Grid Station 4, New Delhi',
                'requested_at'     => Carbon::now()->subHours(5),
            ],
        ];
        $createdRequests = [];
        foreach ($requests as $r) {
            $createdRequests[] = ServiceRequest::create($r);
        }
        $dispatch1 = Dispatch::create([
            'request_id'    => $createdRequests[0]->id,
            'technician_id' => $technicians[0]->id,
            'dispatcher_id' => $dispatcher->id,
            'status'        => 'completed',
            'assigned_at'   => Carbon::now()->subDays(5),
            'accepted_at'   => Carbon::now()->subDays(5)->addMinutes(5),
            'en_route_at'   => Carbon::now()->subDays(5)->addMinutes(10),
            'arrived_at'    => Carbon::now()->subDays(5)->addMinutes(45),
            'completed_at'  => Carbon::now()->subDays(4),
            'distance_km'   => 3.2,
        ]);
        Rating::create([
            'dispatch_id'   => $dispatch1->id,
            'rated_by'      => $client1->id,
            'technician_id' => $technicians[0]->id,
            'score'         => 5,
            'comment'       => 'Excellent work! Fixed the issue quickly.',
        ]);
        Dispatch::create([
            'request_id'    => $createdRequests[3]->id,
            'technician_id' => $technicians[2]->id,
            'dispatcher_id' => $dispatcher->id,
            'status'        => 'pending',
            'assigned_at'   => Carbon::now()->subHours(3),
            'distance_km'   => 5.8,
        ]);
        Notification::create([
            'user_id' => $client1->id,
            'type'    => 'job_completed',
            'message' => 'Your service request "Main breaker keeps tripping" has been completed.',
            'data'    => ['request_id' => $createdRequests[0]->id],
            'is_read' => true,
        ]);
        Notification::create([
            'user_id' => $client2->id,
            'type'    => 'dispatch_assigned',
            'message' => 'A technician has been assigned to your transformer inspection.',
            'data'    => ['request_id' => $createdRequests[3]->id],
            'is_read' => false,
        ]);
        echo "✅ Seeded: 1 admin, 1 dispatcher, 5 technicians, 2 clients, 12 skills, 7 requests, 2 dispatches\n";
    }
}
