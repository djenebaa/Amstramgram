<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller as BaseController;

class UserController extends BaseController
{
    public function getCurrentUser(Request $request)
{
    // Returns the authenticated user
    return response()->json($request->user());
}

}
