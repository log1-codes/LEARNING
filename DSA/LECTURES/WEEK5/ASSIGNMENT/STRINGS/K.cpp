#include<bits/stdc++.h>
using namespace std;

int main()
{
    string s; 
    cin >> s;

    if(s.length() != 10)
    {
        cout << "Weak";
        return 0; 
    }

    bool hasLower = false; 
    bool hasUpper = false;
    bool hasDigit = false;
    bool hasSpecial = false;

    for(char c : s)
    {
        if(islower(c)) {
            hasLower = true;
        }
        else if(isupper(c)) {
            hasUpper = true;
        }
        else if(isdigit(c)) {
            hasDigit = true;
        }
        else {
            hasSpecial = true;
        }
    }

    if (hasLower && hasUpper && hasDigit && hasSpecial) {
        cout << "Strong";
    } else {
        cout << "Weak";
    }

    return 0;
}
