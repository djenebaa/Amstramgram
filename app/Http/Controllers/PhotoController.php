<?php

namespace App\Http\Controllers;
use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\RedirectResponse;

class PhotoController extends Controller
{
    public function uploadPhoto(Request $request ) 
    {
        print_r('Coucou');
        if($request->hasFile('photo'))
        {
            $file = $request->file('photo');
            $file_name = $file->getClientOriginalName();
            $final_name = $file_name;
            print_r($final_name);

            $request->file('photo')->storeAs('images/', $final_name, 'public');

            // Si l'utilisateur est connecté et que nous voulons associer l'image à cet utilisateur.
            $user = Auth::user();
            $user->image = $final_name;
            $user->save();

            return response()->json(["message" => "Successfully upload a profile photo"]);
        } else {
            return response()->json(["message" => "You must select a photo first "]);
        }
    }
}


