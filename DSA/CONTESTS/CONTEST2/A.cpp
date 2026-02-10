#include <iostream>
using namespace std;

int main() {
    int N;
    cin >> N;

    int pass = 0, fail = 0;
    int mark;

    for (int i = 0; i < N; i++) {
        cin >> mark;
        if (mark >= 0) { } 
    }

    int P;
    cin >> P;  

    cin.clear();
    cin.seekg(0, ios::beg);

    cin >> N;
    for (int i = 0; i < N; i++) {
        cin >> mark;
        if (mark >= P)
            pass++;
        else
            fail++;
    }

    cout << "Pass: " << pass << endl;
    cout << "Fail: " << fail << endl;

    return 0;
}
